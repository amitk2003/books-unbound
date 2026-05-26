import express from "express";
import Review from "../model/review.js";
import bookinfo from "../model/book.js";
import authToken from "./userAuthtoken.js";

const reviewRouter = express.Router();

// Add review
reviewRouter.post("/add-review", authToken, async (req, res) => {
    try {
        const { book_id, rating, comment } = req.body;
        const { id } = req.headers;

        const newReview = new Review({
            book: book_id,
            user: id,
            rating,
            comment
        });

        await newReview.save();

        // Update book average rating and count
        const book = await bookinfo.findById(book_id);
        const reviews = await Review.find({ book: book_id });
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        
        book.rating = (totalRating / reviews.length).toFixed(1);
        book.reviews_count = reviews.length;
        await book.save();

        res.status(200).json({ message: "Review added successfully", rating: book.rating });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get reviews for a book
reviewRouter.get("/get-reviews/:book_id", async (req, res) => {
    try {
        const { book_id } = req.params;
        const reviews = await Review.find({ book: book_id })
            .populate("user", "Username avatar")
            .sort({ createdAt: -1 });

        res.status(200).json({ status: "success", data: reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default reviewRouter;
