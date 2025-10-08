import express from "express";
import User from "../model/User_schema.js";
import authToken from "./userAuthtoken.js";

const cart_route = express.Router();

// ➤ Add book to cart
cart_route.put("/add-to-cart", authToken, async (req, res) => {
  try {
    const { bookid } = req.body; // bookid should come from body now
    const userId = req.user.id;  // extracted from token by authToken

    const userdata = await User.findById(userId);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    // avoid duplicates
    const isBookInCart = userdata.cart.includes(bookid);
    if (isBookInCart) {
      return res.status(200).json({ message: "Book is already in cart" });
    }

    await User.findByIdAndUpdate(userId, { $push: { cart: bookid } });
    return res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ➤ Remove book from cart
cart_route.put("/remove-book-from-cart/:bookid", authToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const userId = req.user.id;

    const userdata = await User.findById(userId);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userdata.cart.includes(bookid);
    if (isBookInCart) {
      await User.findByIdAndUpdate(userId, { $pull: { cart: bookid } });
    }

    return res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ➤ Get user cart
cart_route.get("/get-user-cart", authToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await User.findById(userId).populate("cart");
    console.log(userId,userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // const cart_data = userData.cart.reverse(); // latest first
    return res.json({
      status: "success",
      data: userData.cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

export default cart_route;
