import React from 'react';
import { motion } from 'framer-motion';
import heroImage from './hero.png';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row w-full overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black relative">

      {/* Decorative light effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,200,0.1),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,0,0.08),transparent_60%)] pointer-events-none"></div>

      {/* Image Section (Top on mobile, Right on large) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: '0px 0px 60px rgba(255, 230, 150, 0.4)',
        }}
        className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative"
      >
        <motion.img
          src={heroImage}
          alt="hero"
          className="w-[90%] sm:w-[80%] md:w-[90%] max-h-[60vh] md:max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-yellow-200/20"
          animate={{
            y: [0, -15, 0],
            filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Glow behind image */}
        <div className="absolute inset-0 blur-3xl bg-gradient-to-tr from-yellow-400/20 via-amber-200/10 to-transparent rounded-3xl"></div>
      </motion.div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center px-6 sm:px-10 md:px-12 py-10 md:py-0 relative z-10 text-center md:text-left">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-yellow-100 leading-snug"
        >
          Unlock the Boundless World of Stories
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-base sm:text-lg md:text-xl text-zinc-300 max-w-[90%] sm:max-w-[80%] md:max-w-none"
        >
          Explore limitless tales, profound knowledge, and endless inspiration on every page.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 sm:mt-10"
        >
          <Link
            to="/all-books"
            className="text-yellow-100 text-lg sm:text-xl font-semibold border border-yellow-100 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full
                       hover:bg-yellow-100 hover:text-black transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
          >
            Discover Books
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
