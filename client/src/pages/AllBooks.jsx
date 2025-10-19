import React, { useState, useEffect } from "react";
import Loader from "../components/Loader/Loader";
import Bookcard from "../components/Bookcard/Bookcard";
import axios from "axios";
import { motion } from "framer-motion";
import { configDotenv } from "dotenv";
export default function AllBooks() {
  const [book, setBook] = useState();
  const BASE_URL=import.meta.env.MODE=='development'?'http://localhost:3000':'htps://books-unbound-fshw.vercel.app'
  
  useEffect(() => {
    const fetch = async () => {
      const Response = await axios.get(BASE_URL+"/api/get-all");
      setBook(Response.data.data);
    };
    fetch();
  }, []);


  return (
    <div className="bg-zinc-900 px-5">
      <h4 className="text-3xl text-yellow-100">All Books</h4>

      {!book && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {book &&
          book.map((items, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03, y: -5 }}   // 👈 slight zoom + lift
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Bookcard book={items} />
            </motion.div>
          ))}
      </div>
    </div>
  );
}
