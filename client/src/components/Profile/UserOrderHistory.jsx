import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../Loader/Loader.jsx";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/get-order-history`,
          { headers }
        );
        setOrders(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* =====================
     1️⃣ LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  /* =====================
     2️⃣ EMPTY STATE
  ====================== */
  if (orders.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-zinc-400">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          No Order History
        </h1>
        <img
          src="https://img.freepik.com/free-vector/flat-design-out-order-sign-template_742173-7789.jpg"
          alt="No orders"
          className="h-[20vh]"
        />
      </div>
    );
  }

  /* =====================
     3️⃣ DATA STATE
  ====================== */
  return (
    <div className="p-4 md:p-6 text-zinc-100">
      <h1 className="text-3xl md:text-4xl font-semibold text-zinc-500 mb-6">
        Your Order History
      </h1>

      {/* Desktop Header */}
      <div className="hidden md:flex bg-zinc-800 rounded-md py-2 px-4 text-zinc-400 font-semibold mb-3">
        <div className="w-[5%] text-center">#</div>
        <div className="w-[25%]">Book</div>
        <div className="w-[35%]">Description</div>
        <div className="w-[10%]">Price</div>
        <div className="w-[15%]">Status</div>
        <div className="w-[10%]">Payment</div>
      </div>

      {orders.map((item, index) => (
        <div
          key={item._id}
          className="bg-zinc-800 rounded-lg p-4 mb-4 hover:bg-zinc-900 transition"
        >
          {/* =====================
              MOBILE CARD VIEW
          ====================== */}
          <div className="flex flex-col gap-3 md:hidden">
            <Link
              to={`/view-book-details/${item.book._id}`}
              className="text-lg font-semibold text-green-400"
            >
              {item.book.title}
            </Link>

            <p className="text-sm text-zinc-300">
              {item.book.desc.slice(0, 80)}...
            </p>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                ₹{item.book.price}
              </span>

              {item.status === "ORDER_PLACED" && (
                <span className="text-yellow-500 font-semibold">
                  Order Placed
                </span>
              )}
              {item.status === "DELIVERED" && (
                <span className="text-green-500 font-semibold">
                  Delivered
                </span>
              )}
              {item.status === "CANCELLED" && (
                <span className="text-red-500 font-semibold">
                  Cancelled
                </span>
              )}
            </div>

            <span className="text-xs text-zinc-400">
              Payment: Cash on Delivery
            </span>
          </div>

          {/* =====================
              DESKTOP ROW VIEW
          ====================== */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="w-[5%] text-center">
              {index + 1}
            </div>

            <div className="w-[25%]">
              <Link
                to={`/view-book-details/${item.book._id}`}
                className="hover:text-green-400"
              >
                {item.book.title}
              </Link>
            </div>

            <div className="w-[35%] text-sm text-zinc-300">
              {item.book.desc.slice(0, 60)}...
            </div>

            <div className="w-[10%] font-semibold">
              ₹{item.book.price}
            </div>

            <div className="w-[15%] font-bold">
              {item.status === "ORDER_PLACED" && (
                <span className="text-yellow-500">Order Placed</span>
              )}
              {item.status === "DELIVERED" && (
                <span className="text-green-500">Delivered</span>
              )}
              {item.status === "CANCELLED" && (
                <span className="text-red-500">Cancelled</span>
              )}
            </div>

            <div className="w-[10%] text-sm text-zinc-400">
              COD
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrderHistory;
