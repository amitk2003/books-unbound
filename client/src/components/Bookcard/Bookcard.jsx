
// src/components/Bookcard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from "../../store/cart.js";


const Bookcard = ({ book }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation when clicking the button
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart');
      return;
    }
    dispatch(addToCart(book._id)).then((result) => {
      if (addToCart.fulfilled.match(result)) {
        alert('Book added to cart');
      } else {
        alert(result.payload || 'Failed to add book to cart');
      }
    });
  };

  return (
    <Link to={`/view-book-details/${book._id}`}>
      <div className="bg-zinc-700 rounded p-5 flex flex-col h-[50vh] sm:h-[60vh] w-full max-w-xs mx-auto">
        {/* Image */}
        <div className="bg-zinc-600 rounded flex items-center justify-center">
          <img
            src={book.url}
            alt={book.title}
            className="h-[20vh] w-full object-cover rounded"
          />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-lg text-zinc-300 font-semibold truncate">
          {book.title}
        </h2>

        {/* Author */}
        <p className="mt-2 text-zinc-400">by {book.author}</p>

        {/* Price */}
        <p className="mt-2 text-zinc-200 font-semibold text-lg">
          {book.price}₹
        </p>

        {/* Add to Cart Button */}
        <button
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default Bookcard;