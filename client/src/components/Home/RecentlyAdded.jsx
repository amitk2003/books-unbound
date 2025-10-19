import React, { useEffect, useState } from "react";
import axios from "axios";
import Bookcard from "../Bookcard/Bookcard.jsx";
import Loader from "../Loader/Loader.jsx";
import { motion } from "framer-motion";
import { getBaseUrl } from "../../utils/config.js";
export default function RecentlyAdded() {
  const [book, setBook] = useState([]); // ✅ start as empty array
  const [loading, setLoading] = useState(true); // ✅ loading state
  const BASE_URL=getBaseUrl()
  useEffect(() => {
    const fetch = async () => {
      try {
        const Response = await axios.get(BASE_URL+"/api/get-recent-book");
        setBook(Response.data.data || []); // ✅ safe fallback
      } catch (error) {
        console.error("Error fetching recent books:", error);
        setBook([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Variants for stagger animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // stagger each card
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="mt-10 px-4">
      <h4 className="text-3xl text-yellow-100">Recently Added Books</h4>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : book.length === 0 ? (
        <p className="text-gray-400 mt-6">No recently added books found.</p>
      ) : (
        <motion.div
          className="my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {book.map((items, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.05, rotate: 1 }}
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Bookcard book={items} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
