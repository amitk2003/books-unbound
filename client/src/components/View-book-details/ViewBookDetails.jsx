import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { MdDelete } from "react-icons/md";
import Loader from "../Loader/Loader.jsx";
import { GrLanguage } from "react-icons/gr";
import { FaShoppingCart, FaEdit } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isLoading, setIsLoading] = useState(true);
  
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const token = localStorage.getItem("token");

  const fetchBook = async () => {
    try {
      const Response = await api.get(`/api/get-book-by-id/${id}`);
      setBook(Response.data.data);
      const reviewsRes = await api.get(`/api/get-reviews/${id}`);
      setReviews(reviewsRes.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleAddToFavourite = async () => {
    if (!token) return alert("Please sign in first");
    try {
      const response = await api.put('/api/add-book-to-favourite', { bookid: id }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add favourite.');
    }
  };

  const handleAddToCart = async () => {
    if (!token) return alert("Please sign in first");
    try {
      const response = await api.put('/api/add-to-cart', { bookid: id }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please sign in first");
    try {
      await api.post('/api/add-review', 
        { book_id: id, ...newReview },
        { headers: { Authorization: `Bearer ${token}`, id: localStorage.getItem("id") } }
      );
      setNewReview({ rating: 5, comment: "" });
      fetchBook();
      alert("Review submitted!");
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (isLoading) return <div className="h-screen bg-zinc-900 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="bg-zinc-900 min-h-screen py-12 px-4 md:px-12">
      {book && (
        <div className="max-w-7xl mx-auto">
          {/* Main Book Content Section */}
          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            {/* Left: Book Image & Actions */}
            <div className="lg:w-2/5">
              <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-2xl border border-zinc-700/50 shadow-2xl sticky top-8">
                <div className="aspect-[3/4.5] rounded-xl overflow-hidden shadow-2xl mb-8 group">
                  <img src={book.url} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                {isLoggedIn && role === "user" && (
                  <div className="flex gap-4">
                    <button 
                      onClick={handleAddToFavourite}
                      className="flex-1 bg-zinc-700 hover:bg-red-500/20 hover:text-red-500 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold border border-zinc-600 hover:border-red-500/50"
                    >
                      <FaRegHeart className="text-xl" /> Favourites
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-zinc-900 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold shadow-lg shadow-yellow-500/20"
                    >
                      <FaShoppingCart className="text-xl" /> Add to Cart
                    </button>
                  </div>
                )}

                {isLoggedIn && role === "admin" && (
                  <div className="flex gap-4">
                    <button 
                        onClick={() => navigate(`/profile/update-book/${id}`)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold"
                    >
                      <FaEdit /> Edit Book
                    </button>
                    <button 
                        onClick={async () => {
                            if(window.confirm("Are you sure you want to delete this book?")) {
                                try {
                                    await api.delete("/api/delete-book", { headers: { book_id: id } });
                                    alert("Book deleted.");
                                    navigate("/all-books");
                                } catch(err) { alert("Failed to delete."); }
                            }
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold"
                    >
                      <MdDelete /> Delete Book
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Book Details */}
            <div className="lg:w-3/5 flex flex-col pt-4">
              <div className="mb-6">
                <span className="bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-500/20 mb-4 inline-block">
                  {book.genre || "General"}
                </span>
                <h1 className="text-5xl font-black text-zinc-100 mb-4 leading-tight">{book.title}</h1>
                <p className="text-2xl text-zinc-400 font-medium italic">by {book.author}</p>
              </div>

              <div className="flex items-center gap-6 mb-8 text-zinc-400 border-y border-zinc-700/50 py-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 text-xl">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(book.rating || 4.5) ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-zinc-100 font-bold text-lg">{book.rating || "4.5"}</span>
                  <span className="text-zinc-500">({book.reviews_count || 0} reviews)</span>
                </div>
                <div className="w-px h-6 bg-zinc-700"></div>
                <div className="flex items-center gap-2">
                  <GrLanguage className="text-xl" /> <span>{book.language}</span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-zinc-100 text-xl font-bold mb-4">Description</h3>
                <p className="text-zinc-400 leading-relaxed text-lg text-justify">{book.desc}</p>
              </div>

              <div className="mt-auto">
                <p className="text-5xl font-black text-yellow-100">₹{book.price}</p>
                <p className="text-zinc-500 mt-2">Inclusive of all taxes</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-zinc-800 pt-16">
            {/* Review Form */}
            <div>
              <h2 className="text-3xl font-bold text-zinc-100 mb-8">Customer Reviews</h2>
              {isLoggedIn ? (
                <form onSubmit={handleSubmitReview} className="bg-zinc-800/30 p-8 rounded-2xl border border-zinc-700/50">
                  <h4 className="text-zinc-200 font-bold mb-6">Write a review</h4>
                  <div className="mb-6">
                    <label className="block text-zinc-400 text-sm mb-2">Rating</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: num })}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all border ${
                            newReview.rating >= num 
                            ? "bg-yellow-500 text-zinc-900 border-yellow-500" 
                            : "bg-zinc-700 text-zinc-400 border-zinc-600 hover:border-zinc-400"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-zinc-400 text-sm mb-2">Comment</label>
                    <textarea 
                      className="w-full bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all h-32"
                      placeholder="Share your thoughts about this book..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-zinc-900 py-4 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/10">
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="bg-zinc-800/30 p-8 rounded-2xl border border-zinc-700/50 text-center">
                  <p className="text-zinc-400 mb-4">Please log in to leave a review</p>
                  <button className="bg-zinc-700 text-zinc-100 px-8 py-2 rounded-lg hover:bg-zinc-600 transition-all">Sign In</button>
                </div>
              )}
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/50 hover:bg-zinc-800/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img src={rev.user?.avatar} alt={rev.user?.Username} className="w-10 h-10 rounded-full object-cover border border-zinc-600" />
                        <div>
                          <p className="text-zinc-200 font-bold">{rev.user?.Username}</p>
                          <p className="text-zinc-500 text-xs">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-300 italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookDetails;
