
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
    <div className="bg-zinc-700 rounded p-4 flex flex-col h-auto sm:h-[80vh] w-full max-w-xs mx-auto">
      
      {/* Image */}
      <Link to={`/view-book-details/${book._id}`} className="bg-zinc-600 rounded flex items-center justify-center overflow-hidden">
        <img
          src={book.url}
          alt={book.title}
          className="h-[25vh] sm:h-[40vh] w-full object-cover rounded"
        />
      </Link>

      {/* Title */}
      <h2 className="mt-3 text-lg sm:text-xl text-zinc-300 font-semibold truncate">
        {book.title}
      </h2>

      {/* Author */}
      <p className="mt-1 text-zinc-400 text-sm sm:text-base">by {book.author}</p>

      {/* Price */}
      <p className="mt-2 text-zinc-200 font-semibold text-lg sm:text-xl">
        {book.price}₹
      </p>

      {/* Add to Cart Button */}
      <button
        className="mt-auto bg-blue-500 text-white py-2 rounded hover:bg-blue-600 w-full text-sm sm:text-base"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
 
};

export default Bookcard;