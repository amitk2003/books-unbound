import express from "express";
import User from "../model/User_schema.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import authToken from "./userAuthtoken.js";

const router = express.Router();
const secret_code = process.env.JWT_AUTH_TOKEN;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// =============================
// EMAIL TRANSPORTER
// =============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// =============================
// HELPER — generate JWT
// =============================
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.Username, role: user.role },
    secret_code,
    { expiresIn: "400d" }
  );


// =============================
// GOOGLE AUTH (sign-up + sign-in combined)
// If user exists  → log them in
// If user doesn't → create account then log in
// =============================
router.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: "No token provided" });
  }

  try {
    // 1. Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // 2. Find existing user by email OR googleId
    let user = await User.findOne({
      $or: [{ Email: email }, { googleId: googleId }],
    });

    if (!user) {
      // 3a. New user — create account
      // Generate a unique username from their Google name
      let baseUsername = name.replace(/\s+/g, "").toLowerCase();
      let username = baseUsername;
      let count = 1;

      // Make sure username is unique
      while (await User.findOne({ Username: username })) {
        username = `${baseUsername}${count++}`;
      }

      user = await User.create({
        Username: username,
        Email: email,
        password: "",       // no password for Google users
        address: "",
        googleId: googleId,
        avatar: picture || "",
      });

      console.log(`New Google user created: ${email}`);
    } else {
      // 3b. Existing user — update googleId/avatar if missing
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture || "";
        await user.save();
      }
      console.log(`Existing Google user logged in: ${email}`);
    }

    // 4. Issue JWT
    const authJwt = generateToken(user);

    return res.status(200).json({
      success: true,
      id: user._id,
      role: user.role,
      token: authJwt,
    });
  } catch (error) {
    console.error("Google auth error:", error.message);
    return res.status(401).json({ success: false, error: "Invalid Google token" });
  }
});


// =============================
// SIGN UP (email + password)
// =============================
router.post("/sign-up", async (req, res) => {
  try {
    const { Username, Email, password, address } = req.body;

    if (!Username || !Email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters" });
    }

    if (password.length <= 5) {
      return res.status(400).json({ message: "Password must be more than 5 characters" });
    }

    const existingUser = await User.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmail = await User.findOne({ Email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hash_password = await bcrypt.hash(password, 10);

    const newUser = new User({
      Username,
      Email,
      password: hash_password,
      address,
    });

    await newUser.save();
    return res.status(200).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Sign-up error:", error);
    return res.status(500).json({ error: "Error during sign up" });
  }
});


// =============================
// LOGIN (email + password)
// =============================
router.post("/login", async (req, res) => {
  try {
    const { Username, password } = req.body;

    const existingUser = await User.findOne({ Username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Block Google-only accounts from password login
    if (!existingUser.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please use Continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(existingUser);

    return res.status(200).json({
      id: existingUser._id,
      role: existingUser.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Error during login" });
  }
});


// =============================
// GET USER INFO
// =============================
router.get("/get-userInfo", authToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password -resetPasswordToken -resetPasswordExpiry");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// =============================
// UPDATE ADDRESS
// =============================
router.put("/update-Address", authToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address });
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// =============================
// UPDATE EMAIL
// =============================
router.put("/update-Email", authToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { Email } = req.body;
    await User.findByIdAndUpdate(id, { Email });
    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// =============================
// CHANGE PASSWORD (logged-in user)
// =============================
router.put("/change-password", authToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { current_password, new_password } = req.body;

    const user = await User.findById(id);

    // Google users have no password set
    if (!user.password) {
      return res.status(400).json({ message: "Google accounts cannot change password here" });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (new_password.length <= 5) {
      return res.status(400).json({ message: "New password must be more than 5 characters" });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await User.findByIdAndUpdate(id, { password: hashed });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// =============================
// FORGOT PASSWORD — step 1
// User submits their email → backend sends reset link
// =============================
router.post("/forgot-password", async (req, res) => {
  try {
    const { Email } = req.body;

    if (!Email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ Email });

    // Always return success even if email not found (security best practice)
    // This prevents email enumeration attacks
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Block Google-only accounts
    if (!user.password) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token + expiry (15 minutes) to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Build the reset URL pointing to your frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hi <strong>${user.Username}</strong>,</p>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 13px;">This link expires in <strong>15 minutes</strong>.</p>
        <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">Books Unbound — password reset</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Books Unbound" <${process.env.EMAIL_USER}>`,
      to: user.Email,
      subject: "Password Reset Request",
      html,
    });

    console.log(`Password reset email sent to ${user.Email}`);
    return res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// =============================
// RESET PASSWORD — step 2
// User submits new password with the token from the email link
// =============================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { new_password } = req.body;

    if (!new_password || new_password.length <= 5) {
      return res.status(400).json({ message: "Password must be more than 5 characters" });
    }

    // Hash the incoming token to compare against stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired. Please request a new one.",
      });
    }

    // Set new password and clear the reset token
    user.password = await bcrypt.hash(new_password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


export default router;