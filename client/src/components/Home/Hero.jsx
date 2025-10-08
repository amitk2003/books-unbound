import React from 'react';
import heroImage from './hero.png';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="h-[100vh] flex flex-col md:flex-row w-[100%] overflow:hidden">
      
      {/* Text Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center px-6 lg:px-12 py-10">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Unlock the Boundless World of Stories
        </h1>
        <p className="mt-4 text-xl text-zinc-300 text-center lg:text-left">
          Explore limitless tales, profound knowledge, and endless inspiration on every page.
        </p>
        <div className="mt-10">
          <Link 
            to="/all-books" 
            className="text-yellow-100 text-xl lg:text-2xl font-semibold border border-yellow-100 px-10 py-4 hover:bg-zinc-800 rounded-full">
            Discover Books
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full   lg:w-1/2 flex items-center justify-center">
        <img 
          src={heroImage} 
          alt="hero" 
          className="w-full max-h-full object-cover border border-zinc-300 rounded-2xl" 
        />
      </div>
    </div>
  );
}
