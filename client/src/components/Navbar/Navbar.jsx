import React, { useState } from "react";
import { FaHamburger } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import books from "./books.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [MobileNav, setMobileNav] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // ✅ Create a new array instead of mutating original
  const filteredLinks = React.useMemo(() => {
    const base = [
      { title: "Home", link: "/" },
      { title: "AllBooks", link: "/all-books" },
      ...(isLoggedIn ? [{ title: "Cart", link: "/cart" }] : []),
      { title: "Profile", link: "/profile" },
      ...(role === "admin" ? [{ title: "Admin Profile", link: "/admin-profile" }] : [])
    ];
    return base;
  }, [isLoggedIn, role]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-zinc-800 text-white px-6 py-4 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center">
          <img src={books} alt="logo" className="h-10 me-4" />
          <div className="text-2xl font-semibold">Books Unbound</div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8">
          {filteredLinks.map((item, i) => (
            <div className="flex items-center" key={i}>
              <Link to={item.link} className="hover:text-blue-400 transition-all duration-300">
                {item.title}
              </Link>
            </div>
          ))}

          {isLoggedIn === false && (
            <>
              <Link to="/login" className="px-6 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800">
                Login
              </Link>
              <Link to="/sign-up" className="px-5 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white text-2xl hover:text-zinc-400" onClick={() => setMobileNav(!MobileNav)}>
          {MobileNav ? <FiX /> : <FaHamburger />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed top-0 left-0 w-full h-screen bg-zinc-800 flex flex-col items-center justify-center ${MobileNav ? "flex" : "hidden"}`}>
        {filteredLinks.map((item, i) => (
          <Link key={i} to={item.link} className="text-3xl mb-4 hover:text-blue-400" onClick={() => setMobileNav(false)}>
            {item.title}
          </Link>
        ))}

        {isLoggedIn === false && (
          <>
            <Link to="/login" className="text-3xl px-6 py-1 border border-blue-500 rounded mb-4" onClick={() => setMobileNav(false)}>
              Login
            </Link>
            <Link to="/sign-up" className="text-3xl px-5 py-1 border border-blue-500 rounded" onClick={() => setMobileNav(false)}>
              Signup
            </Link>
          </>
        )}
      </div>
    </>
  );
}
