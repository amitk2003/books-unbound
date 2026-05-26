import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

import User from "../model/User_schema.js";
import OrderData from "../model/order.js";
import authToken from "./userAuthtoken.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const order_route = express.Router();


// =============================
// EMAIL TRANSPORTER SETUP
// =============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async ({
  toEmail,
  userName,
  orderId,
  books,
  paymentType,
  totalAmount,
}) => {
  const bookListHTML = books
    .map(
      (item) =>
        `<li style="padding: 4px 0;">${item.title} &times; ${item.quantity} &mdash; &#8377;${item.price * item.quantity}</li>`
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #333;">Order Confirmed!</h2>
      <p>Hi <strong>${userName}</strong>, your order has been placed successfully.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="color: #666; padding: 6px 0;">Order ID</td>
          <td><strong>${orderId}</strong></td>
        </tr>
        <tr>
          <td style="color: #666; padding: 6px 0;">Payment</td>
          <td><strong>${paymentType === "COD" ? "Cash on Delivery" : "Online (Paid)"}</strong></td>
        </tr>
        <tr>
          <td style="color: #666; padding: 6px 0;">Total</td>
          <td><strong>&#8377;${totalAmount}</strong></td>
        </tr>
      </table>

      <h3 style="color: #333; border-top: 1px solid #eee; padding-top: 16px;">Books Ordered</h3>
      <ul style="padding-left: 20px; color: #444;">
        ${bookListHTML}
      </ul>

      <p style="margin-top: 24px; color: #888; font-size: 13px;">
        Thank you for shopping with us. We will notify you when your order ships.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"BookStore" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Order Confirmed — #${orderId}`,
    html,
  });
};


// =============================
// STRIPE CHECKOUT SESSION
// =============================
order_route.post("/create-checkout-session", authToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { books } = req.body;

    const line_items = books.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      metadata: {
        userId: id,
        books: JSON.stringify(books),
      },
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.log("Stripe session error:", error);
    res.status(500).json({ message: "Stripe session error" });
  }
});


// =============================
// STRIPE WEBHOOK (PAYMENT VERIFY)
// =============================
order_route.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const books = JSON.parse(session.metadata.books);

      const order = new OrderData({
        userId,
        books,
        paymentType: "ONLINE",
        paymentStatus: "Completed",
      });

      const savedOrder = await order.save();

      await User.findByIdAndUpdate(userId, {
        $push: { order: savedOrder._id },
        $pull: { cart: { _id: { $in: books.map((item) => item.book) } } },
      });

      // Send confirmation email
      try {
        const user = await User.findById(userId);
        const totalAmount = books.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        await sendOrderConfirmationEmail({
          toEmail: user.email,
          userName: user.name,
          orderId: savedOrder._id,
          books,
          paymentType: "ONLINE",
          totalAmount,
        });

        console.log("Order confirmation email sent (ONLINE)");
      } catch (emailErr) {
        console.error("Email send failed (ONLINE):", emailErr.message);
      }

      console.log("Order created after Stripe payment");
    }

    res.json({ received: true });
  }
);


// =============================
// COD ORDER PLACEMENT
// =============================
order_route.post("/place-order-cod", authToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { books } = req.body;

    const order = new OrderData({
      userId: id,
      books,
      paymentType: "COD",
      paymentStatus: "Pending",
    });

    const savedOrder = await order.save();

    await User.findByIdAndUpdate(id, {
      $push: { order: savedOrder._id },
      $pull: { cart: { _id: { $in: books.map((item) => item.book) } } },
    });

    // Send confirmation email
    try {
      const user = await User.findById(id);
      const totalAmount = books.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await sendOrderConfirmationEmail({
        toEmail: user.email,
        userName: user.name,
        orderId: savedOrder._id,
        books,
        paymentType: "COD",
        totalAmount,
      });

      console.log("Order confirmation email sent (COD)");
    } catch (emailErr) {
      console.error("Email send failed (COD):", emailErr.message);
    }

    res.json({
      status: "success",
      message: "COD order placed successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.log("COD order error:", error);
    res.status(500).json({ message: "server error" });
  }
});


// =============================
// GENERATE DELIVERY OTP (COD)
// =============================
order_route.post("/generate-delivery-otp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderData.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentType !== "COD") {
      return res.json({ message: "OTP only for COD orders" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    order.deliveryOTP = otp;
    order.otpExpiry = Date.now() + 10 * 60 * 1000;

    await order.save();

    res.json({ message: "Delivery OTP generated", otp });
  } catch (error) {
    console.log("Generate OTP error:", error);
    res.status(500).json({ message: "server error" });
  }
});


// =============================
// VERIFY DELIVERY OTP
// =============================
order_route.post("/verify-delivery-otp", async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    const order = await OrderData.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (order.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    order.status = "DELIVERED";
    order.deliveryOTP = null;
    order.paymentStatus = "Completed"; // mark COD as paid on delivery

    await order.save();

    res.json({ message: "Order delivered successfully" });
  } catch (error) {
    console.log("Verify OTP error:", error);
    res.status(500).json({ message: "server error" });
  }
});


// =============================
// USER ORDER HISTORY
// =============================
order_route.get("/get-order-history", authToken, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res.status(400).json({ message: "User id missing in headers" });
    }

    const user = await User.findById(id).populate({
      path: "order",
      populate: { path: "books.book" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      status: "success",
      data: [...user.order].reverse(),
    });
  } catch (error) {
    console.log("Order history error:", error);
    res.status(500).json({ message: "internal server error" });
  }
});


// =============================
// ADMIN GET ALL ORDERS
// =============================
order_route.get("/get-all-orders", authToken, async (req, res) => {
  try {
    const orders = await OrderData.find()
      .populate("books.book")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json({ status: "success", data: orders });
  } catch (error) {
    console.log("Get all orders error:", error);
    res.status(500).json({ message: "internal server error" });
  }
});


// =============================
// ADMIN UPDATE ORDER STATUS
// =============================
order_route.put("/update-status/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: adminId } = req.headers;

    const admin = await User.findById(adminId);

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await OrderData.findByIdAndUpdate(id, { status: req.body.status });

    res.json({ status: "success", message: "Order status updated" });
  } catch (error) {
    console.log("Update status error:", error);
    res.status(500).json({ message: "server error" });
  }
});


export default order_route;