
// src/components/Bookcard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from "../../store/cart.js";
import {motion} from 'framer-motion'

const Bookcard = ({ book }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart');
      return;
    }
    dispatch(addToCart(book._id)).then((result) => {
      if (addToCart.fulfilled.match(result)) {
        alert('Book added to cart');
      }
    });
  };

  return (
    <motion.div 
      whileHover={{ 
        rotateY: 15, 
        rotateX: -5, 
        scale: 1.05,
        z: 50 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      className="bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-4 flex flex-col h-full shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 group"
    >
      {/* Image Container with Depth */}
      <Link 
        to={`/view-book-details/${book._id}`} 
        className="relative bg-zinc-900 rounded-xl aspect-[3/4] overflow-hidden mb-5 block shadow-inner"
        style={{ transform: "translateZ(30px)" }}
      >
        <img
          src={book.url}
          alt={book.title}
          className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10 shadow-xl">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-zinc-100 text-xs font-black">{book.rating || "4.5"}</span>
        </div>
      </Link>

      {/* Content with Depth */}
      <div className="flex-grow flex flex-col" style={{ transform: "translateZ(20px)" }}>
        <h2 className="text-zinc-100 font-extrabold text-lg leading-tight mb-1 group-hover:text-yellow-400 transition-colors line-clamp-1 italic">
          {book.title}
        </h2>
        <p className="text-zinc-500 text-xs mb-4 font-medium tracking-wide">by {book.author}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-700/50">
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-500">
            ₹{book.price}
          </p>
          
          <button
            className="bg-yellow-500 hover:bg-yellow-400 text-black p-3 rounded-xl transition-all duration-300 transform active:scale-75 shadow-lg shadow-yellow-500/20 hover:rotate-12"
            onClick={handleAddToCart}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Bookcard;