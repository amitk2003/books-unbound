import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    genre: "Fiction",
    stock: 10,
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    book_id: id,
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/get-book-by-id/${id}`);
        const book = res.data.data;
        setData({
          url: book.url,
          title: book.title,
          author: book.author,
          price: book.price,
          desc: book.desc,
          language: book.language,
          genre: book.genre || "Fiction",
          stock: book.stock || 10,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBook();
  }, [id]);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = async () => {
    try {
      const response = await api.put("/api/update-book", data, { headers });
      alert(response.data.message);
      navigate(`/view-book-details/${id}`);
    } catch (error) {
      alert("Failed to update book.");
    }
  };

  if (loading) return <div className="h-screen bg-zinc-900 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="h-[100%] p-0 md:p-4">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Update Book</h1>
      <div className="p-4 bg-zinc-800 rounded">
        {/* Same fields as AddBook */}
        <div>
          <label className="text-zinc-400">Image URL</label>
          <input type="text" className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" name="url" value={data.url} onChange={change} />
        </div>
        <div className="mt-4">
          <label className="text-zinc-400">Title</label>
          <input type="text" className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" name="title" value={data.title} onChange={change} />
        </div>
        <div className="mt-4">
          <label className="text-zinc-400">Author</label>
          <input type="text" className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" name="author" value={data.author} onChange={change} />
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label className="text-zinc-400">Language</label>
            <input type="text" className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" name="language" value={data.language} onChange={change} />
          </div>
          <div className="w-3/6">
            <label className="text-zinc-400">Price</label>
            <input type="number" className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" name="price" value={data.price} onChange={change} />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label className="text-zinc-400">Genre</label>
            <select className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" name="genre" value={data.genre} onChange={change}>
              {["Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Biography", "History", "Mystery", "Romance", "Thriller"].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="w-3/6">
            <label className="text-zinc-400">Stock</label>
            <input type="number" className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" name="stock" value={data.stock} onChange={change} />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-zinc-400">Description</label>
          <textarea className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" rows="5" name="desc" value={data.desc} onChange={change} />
        </div>
        <button className="mt-4 px-6 bg-yellow-500 text-zinc-900 font-bold py-2 rounded-xl hover:bg-yellow-400 transition-all" onClick={submit}>
          Update Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;
