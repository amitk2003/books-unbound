import React, { useState } from "react";
import { FaHamburger } from "react-icons/fa"; // Hamburger icon
import { FiX } from "react-icons/fi"; // Close icon
import books from "./books.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


export default function Navbar() {
  const [MobileNav, setMobileNav] =useState(false); // ✅ Use Boolean for Toggle

  const links = [
    { title: "Home", link: "/" },
    { title: "AllBooks", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];
  const isLoggedIn=useSelector((state)=> state.auth.isLoggedIn);
  console.log(isLoggedIn);
  if(isLoggedIn===false){
    // if user is not logged in  then option of cart and profile is not visible
    links.splice(2,2);
    // here links is an array . splice function is  to remove elements from that index
  }
  return (
    <>
      {/* 🔹 Navbar (Desktop & Mobile) */}
      <nav className="fixed top-0 left-0 w-full bg-zinc-800 text-white px-6 py-4 flex items-center justify-between z-50">
        {/* 🔹 Logo */}
        <Link to="/" className="flex items-center">
          <img src={books} alt="logo" className="h-10 me-4" />
          <div className="text-2xl font-semibold">Books Unbound</div>
        </Link>

        {/* 🔹 Desktop Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex gap-8">
          {links.map((item, i) => (
            // <Link key={i} to={item.link} className="hover:text-blue-500 transition-all duration-300">
            //   {item.title}
            // </Link>
           <div className="flex items-center" key={i}>
           {item.title==="Profile" ?(
            <Link to={item.link} className="px-4 py-1 border border-blue-500 rounded hover:text-zinc-500  transition-all duration-300" key={i}>{item.title}</Link>):
            (
              <Link to={item.link} className="hover:text-blue-500 transition-all duration-300" key={i}>{item.title}{" "}</Link>
            )
          }
           </div>
            
          ))}
          {/* 🔹 Login / Signup Buttons */}
          {isLoggedIn=== false && (
            <>
             <Link to="/login" className="px-7 py-2 border border-blue-500 rounded hover:bg-white hover:text-zinc-700 transition-all duration-300">
            Login
          </Link>
          <Link to="/sign-up" className="px-5 py-2 border border-blue-500 rounded hover:bg-white hover:text-zinc-700 transition-all duration-300">
            Signup
          </Link>
            </>
          )}
         
        </div>

        {/* 🔹 Mobile Menu Toggle Button */}
        <button className="md:hidden text-white text-2xl hover:text-zinc-500" onClick={() => setMobileNav(!MobileNav)}>
          {MobileNav ? <FiX /> : <FaHamburger />} {/* 🔄 Toggle Between Icons */}
        </button>
      </nav>

      {/* 🔹 Mobile Menu (Shown Only When `MobileNav === true`) */}
      <div className={`fixed top-0 left-0 w-full h-screen bg-zinc-800 flex flex-col items-center justify-center transition-transform duration-300 ${MobileNav ? "block" : "hidden"}`}>
        {/* 🔹 Mobile Navigation Links */}
        {links.map((item, i) => (
          <Link key={i} to={item.link} className="text-white text-3xl font-semibold mb-4 hover:text-blue-500 transition-all duration-300" onClick={() => setMobileNav(false)}>
            {item.title}
          </Link>
        ))}

        {/* 🔹 Mobile Login / Signup */}
        {isLoggedIn=== false && (
          <>
        <Link to="/login" className="text-white text-3xl px-7 py-2 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 mb-4" onClick={() => setMobileNav(false)}>
          Login
        </Link>
        <Link to="/sign-up" className="text-white text-3xl px-5 py-2 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300" onClick={() => setMobileNav(false)}>
          Signup
        </Link>
          
          </>

        )}
        
        
      </div>
    </>
  );
}
