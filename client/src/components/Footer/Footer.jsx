import React from "react";
import { Link } from "react-router-dom";
import instagram from "./instagram.png";
import LinkedIn from "./linkedin.png";
import email from "./email.png";
import github from "./github.png";


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-800 text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        {/* Logo / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">BookNest 📚</h2>
          <p className="text-sm">
            Your trusted online bookstore for academic, fiction, and professional reads. 
            Explore thousands of titles at affordable prices. 
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/all-books" className="hover:text-white">AllBooks</Link></li>
            <li><Link to="/login" className="hover:text-white">login</Link></li>
            <li><Link to="/profile" className="hover:text-white">profile</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/returns" className="hover:text-white">Returns & Refunds</Link></li>
            <li><Link to="/shipping" className="hover:text-white">Shipping Info</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter + Socials */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Stay Updated</h3>
          <p className="text-sm mb-2">Subscribe to our newsletter for book updates & offers.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 w-full rounded-l-md focus:outline-none text-black"
            />
            <button className="bg-amber-500 px-4 rounded-r-md text-white hover:bg-amber-600">
              Subscribe
            </button>
          </form>
          <div className="mt-4 flex space-x-4">
            <Link to="https://www.instagram.com/amitkumar.6788/">
              <img src={instagram} alt="Instagram" className="w-8 h-8" />
            </Link>
            <Link to="https://www.linkedin.com/in/amit-kumar-a5059624b/">
              <img src={LinkedIn} alt="LinkedIn" className="w-8 h-8" />
            </Link>
            <Link to="mailto:amitk200703@gmail.com">
              <img src={email} alt="Email" className="w-8 h-8" />
            </Link>
            <Link to="https://github.com/amitk2003">
              <img src={github} alt="GitHub" className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400 border-t border-gray-700 mt-8 pt-4">
        © {year} Books Unbound. All rights reserved | Made with ❤️ by Amit Kumar
      </div>
    </footer>
  );
}
