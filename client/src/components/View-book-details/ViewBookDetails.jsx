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
import { getBaseUrl } from "../../utils/config.js";
const ViewBookDetails = () => {
  const BASE_URL=getBaseUrl()
  const { id } = useParams();
  const [book, setBook] = useState();
  // to run every api in project need to use useEffect
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  console.log(isLoggedIn, role);
  
  useEffect(() => {
    const fetch = async () => {
      const Response = await axios.get(
        `/api/get-book-by-id/${id}`
      );
      console.log(Response);
      setBook(Response.data.data);
    };
    fetch();
  }, []);
  // Assuming 'id' is the book ID (e.g., from props or useParams)
// 'token' from localStorage—add a check to avoid null
const token = localStorage.getItem("token");

const handleAddToFavourite = async () => {
  const token = localStorage.getItem("token");
  if (!token || token === 'null' || token === 'undefined') {
    alert("Please sign in first");
    return;
  }

  if (!id || typeof id !== 'string') {
    alert('Invalid book ID. Please refresh.');
    return;
  }

  console.log('Frontend Sending:', { bookid: id, tokenPreview: token.substring(0, 20) + '...' });

  try {
    const response = await axios.put(
      '/api/add-book-to-favourite',
      { bookid: id },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,  // Capital A—matches Postman standard
          'Content-Type': 'application/json'
        } 
      }
    );
    console.log('Frontend Received:', response.data);
    alert(response.data.message);
  } catch (error) {
    console.error('Frontend Error Details:');
    console.error('Status:', error.response?.status);  // e.g., 401
    console.error('Response Body:', error.response?.data);  // e.g., { message: "Invalid token" }
    console.error('Request Config:', error.config?.headers);  // Verify sent headers
    alert(error.response?.data?.message || 'Failed to add favourite.');
  }
};

const handleAddToCart = async () => {
  if (!token) {
    alert("Please sign in first");
    return;
  }
  try {
    const response = await axios.put(
      '/api/add-to-cart',            // URL
      { bookid: id },                // Data: Body with bookid
      { 
        headers: { 
          Authorization: `Bearer ${token}`  // Config: Auth header only
        } 
      }
    );
    alert(response.data.message);  // e.g., "Book added to cart" or "already in cart"
  } catch (error) {
    console.error('Add to Cart Error:', error.response?.data || error.message);
    alert(error.response?.data?.message || 'Failed to add to cart. Try again.');
  }
};
  return (
    <>
      <div className="text-white">
        <Loader />
      </div>
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
                <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-start mt-4 gap-2 lg:mt-0 lg:gap-4 w-full lg:w-auto">
                  <button className="bg-white rounded-full lg:rounded-full text-2xl lg:text-3xl sm:text-3xl  p-3  text-red-600 flex items-center min-w-[120px] lg:min-w-0 hover:bg-red-500 transition-colors" onClick={handleAddToFavourite}>
                    <FaRegHeart className="mr-2 lg:mr-0"/>
                    {""}
                    <span className="hidden sm:inline lg:hidden font-medium">Favourites</span>
                   
                  </button>
                  <button className="text-white rounded-full text-2xl sm:text-3xl lg:text-3xl p-3 bg-blue-400 flex items-center justify-center min-w-[120px] lg:min-w-0 hover:bg-blue-500 transition-colors" onClick={handleAddToCart}>
                    <FaShoppingCart className="mr-2 lg:mr-0"/> {" "}
                    <span className="hidden sm:inline lg:hidden font-medium">Add to cart</span>
                  </button>
                </div>
              )} 
              {isLoggedIn && role === "admin" && (
                <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-start mt-4 gap-2 lg:mt-0 lg:gap-4 w-full lg:w-auto">
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
