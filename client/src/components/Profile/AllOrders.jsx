import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../Loader/Loader";
import { FaUserCircle, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/get-all-orders", { headers });
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const setStatus = async (id, status) => {
    try {
      const response = await api.put(`/api/update-status/${id}`, { status }, { headers });
      alert(response.data.message);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

  return (
    <div className="h-full p-0 md:p-4">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">All Orders</h1>
      
      {orders.length === 0 ? (
        <div className="h-screen flex items-center justify-center text-zinc-400">No orders found</div>
      ) : (
        <div className="bg-zinc-800 rounded p-4 overflow-y-auto">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-6 border-b border-zinc-700 pb-4 text-zinc-400 font-bold">
            <div className="col-span-1">Sr.</div>
            <div className="col-span-1">Books</div>
            <div className="col-span-1">User</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Order List */}
          {orders.map((items, i) => (
            <div key={items._id} className="grid grid-cols-1 md:grid-cols-6 border-b border-zinc-700 py-4 gap-4 items-center hover:bg-zinc-900/50 transition-all rounded px-2">
              <div className="text-zinc-500 md:block hidden">{i + 1}</div>
              
              <div className="col-span-1">
                {items.books.map((bookItem, index) => (
                  <div key={index} className="text-zinc-200 text-sm truncate">{bookItem.book?.title}</div>
                ))}
              </div>

              <div className="col-span-1 flex items-center gap-2">
                <FaUserCircle className="text-zinc-500" />
                <span className="text-zinc-300 truncate">{items.userId?.Username}</span>
              </div>

              <div className="col-span-1 text-yellow-100 font-bold">
                ₹{items.books.reduce((acc, curr) => acc + (curr.book?.price || 0), 0)}
              </div>

              <div className="col-span-1">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  items.status === "Order Placed" ? "bg-blue-500/20 text-blue-500" :
                  items.status === "Out for delivery" ? "bg-yellow-500/20 text-yellow-500" :
                  items.status === "Delivered" ? "bg-green-500/20 text-green-500" :
                  "bg-red-500/20 text-red-500"
                }`}>
                  {items.status}
                </span>
              </div>

              <div className="col-span-1 flex justify-center">
                <select 
                  className="bg-zinc-900 text-zinc-100 border border-zinc-600 rounded p-1 text-xs outline-none cursor-pointer"
                  value={items.status}
                  onChange={(e) => setStatus(items._id, e.target.value)}
                >
                  {["Order Placed", "Out for delivery", "Delivered", "Canceled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
