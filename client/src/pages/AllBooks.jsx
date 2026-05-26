import React, { useState, useEffect } from "react";
import Loader from "../components/Loader/Loader";
import Bookcard from "../components/Bookcard/Bookcard";
import axios from "axios";
import { motion } from "framer-motion";
import api from "../api/axios"

export default function AllBooks() {
  const [book, setBook] = useState();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  const genres = ["All", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Biography", "History", "Mystery", "Romance", "Thriller"];

  useEffect(() => {
    const fetch = async () => {
      const Response = await api.get(`/api/get-all?search=${search}&genre=${genre}`);
      setBook(Response.data.data);
    };
    fetch();
  }, [search, genre]);

  return (
    <div className="bg-zinc-900 min-h-screen px-5 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-yellow-100 mb-2">Explore Our Collection</h1>
            <p className="text-zinc-400">Discover your next favorite book from our curated selection.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title..."
                className="bg-zinc-800 text-zinc-100 border border-zinc-700 px-4 py-2 pl-10 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Genre Filter */}
            <select
              className="bg-zinc-800 text-zinc-100 border border-zinc-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all cursor-pointer"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {!book && (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        )}

        {book && book.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-xl">No books found matching your criteria.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {book &&
            book.map((items, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Bookcard book={items} />
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
