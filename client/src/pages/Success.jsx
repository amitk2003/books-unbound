import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Success = () => {
  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center shadow-2xl max-w-lg w-full"
      >
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
          ✓
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Payment Successful!</h1>
        <p className="text-zinc-400 mb-10 leading-relaxed">
          Thank you for your purchase. Your books are being prepared for shipment and will arrive soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/profile/orderHistory" className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:scale-105 transition-all">
            View Orders
          </Link>
          <Link to="/all-books" className="flex-1 bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-all">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
