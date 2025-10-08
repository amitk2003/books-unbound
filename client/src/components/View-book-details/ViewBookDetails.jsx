import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Bookcard from "../Bookcard/Bookcard.jsx";
import { MdDelete } from "react-icons/md";
import Loader from "../Loader/Loader.jsx";
import { GrLanguage } from "react-icons/gr";
import { FaShoppingCart,FaEdit } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
const ViewBookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState();
  // to run every api in project need to use useEffect
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  console.log(isLoggedIn, role);
  useEffect(() => {
    const fetch = async () => {
      const Response = await axios.get(
        `http://localhost:3000/api/get-book-by-id/${id}`
      );
      console.log(Response);
      setBook(Response.data.data);
    };
    fetch();
  }, []);
  const headers={
    id:localStorage.getItem("id"),
    authorization:`Bearer ${localStorage.getItem("token")}`,
    bookid:id
  };
  const handleAddToFavourite = async () => {
    const response=await axios.put("http://localhost:3000/api/add-book-to-favourite",{},{headers})
    alert(response.data.message)

  }
  const handleAddToCart = async () => {
    const response=await axios.put("http://localhost:3000/api/add-to-cart",{},{headers})
    alert(response.data.message)
  }
  return (
    <>
      <p className="text-white">
        <Loader />
      </p>
      {book && (
        <div className="px-4 md:px-12 py-8  bg-zinc-900 flex  flex-col md:flex-row gap-8 items-start ">
          <div className=" w-[100%] lg:w-3/6">
            {""}
            <div className="flex flex-col lg:flex-row justify-around bg-zinc-800 p-12 rounded gap-0 lg:gap-8">
              {""}
              <img
                src={book.url}
                alt="Book Cover"
                className="h-[50vh] lg:h-[70vh]  "
              />
              {isLoggedIn && role === "user" && (
                <div className="flex flex-row items-center justify-between lg:justify-start mt-8 gap-2 lg:mt-0 md:flex-row lg:flex-col">
                  <button className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl  p-3  mt-0 lg:mt-8 text-red-600 flex items-center" onClick={handleAddToFavourite}>
                    <FaRegHeart />
                    {""}
                    <span className="ms-4 block lg:hidden">Favourites</span>
                   
                  </button>
                  <button className="text-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 lg:mt-8 bg-blue-400 md:mt-0" onClick={handleAddToCart}>
                    <FaShoppingCart /> {" "}
                    <span className="ms-4 block lg:hidden">Add to cart</span>
                  </button>
                </div>
              )}
              {isLoggedIn && role === "admin" && (
                <div className="flex flex-row lg:flex-col  items-center justify-between lg:justify-start mt-8 gap-2 lg:mt-0 md:flex-row ">
                  < button className="bg-yellow-400 rounded lg:rounded-full text-4xl lg:text-3xl  p-3  mt-0 lg:mt-8 flex items-center">
                    <FaEdit />
                    {""}
                    <span className="ms-2 block lg:hidden">Edit</span>
                   
                  </button>
                  <button className="text-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 md:mt-0 lg:mt-8 bg-red-400">
                    <MdDelete /> {" "}
                    <span className="ms-4 block lg:hidden">Delete</span>
                  </button>
                </div>
              )}

            </div>
          </div>
          <div className="p-4 mt-10 w-1/2">
            <h1 className="text-2xl text-zinc-300 font-semibold">
              {book.title}
            </h1>
            <p className="text-zinc-500 mt-3">by{book.author}</p>
            <p className="text-zinc-400 mt-3 text-xl">{book.desc}</p>
            <p className="flex mt-4 items-center justify-start text-zinc-400">
              <GrLanguage className="me-3" />
              {book.language}
            </p>
            <p className="mt-4 text-zinc-100 text-3xl font-semibold">
              {" "}
              Price : ₹{book.price}{" "}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
