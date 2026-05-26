import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Cancel = () => {
  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center shadow-2xl max-w-lg w-full"
      >
        <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-black">
          X
        </div>
        <h1 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tighter">Payment Canceled!</h1>
        <p className="text-zinc-500 mb-10 leading-relaxed">
          No worries. Your payment was not processed. Feel free to explore more books and try again whenever you're ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/cart" className="flex-1 bg-yellow-500 text-zinc-900 font-black py-4 rounded-xl hover:scale-105 transition-all">
            Return to Cart
          </Link>
          <Link to="/all-books" className="flex-1 bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-all">
            Browse Books
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Cancel;
