// src/components/Cart.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import emptyCart from "../assets/empty-cart.png";
import Loader from "../components/Loader/Loader.jsx";
import { MdDelete } from "react-icons/md";
import { fetchCart, removeFromCart } from "../store/cart.js";

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cart, total, isLoading, error } = useSelector((state) => state.cart);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  const handleDeleteItem = (id) => {
    dispatch(removeFromCart(id)).then((res) => {
      if (removeFromCart.fulfilled.match(res)) {
        alert(res.payload.message || "Item removed from cart");
      } else {
        alert(res.payload || "Failed to delete item");
      }
    });
  };

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && error && (
        <div className="h-screen px-12 py-8 bg-zinc-800 flex items-center justify-center flex-col">
          <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">Error Loading Cart</h1>
          <p className="text-zinc-300 mt-4">{error}</p>
        </div>
      )}

      {!isLoading && !error && cart.length === 0 && (
        <div className="h-screen px-12 py-8 bg-zinc-800 flex items-center justify-center flex-col">
          <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">Empty Cart</h1>
          <img src={emptyCart} alt="empty-cart" className="h-[50vh]" />
        </div>
      )}

      {!isLoading && !error && cart.length > 0 && (
        <div>
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">My Cart</h1>

          {cart.map((item) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
              key={item._id}
            >
              <img
                src={item.url}
                alt={`${item.title} cover`}
                className="h-[15vh] w-3xs md:h-[10vh] object-contain"
              />

              <div className="w-full md:w-auto">
                <h1 className="text-2xl text-zinc-100 font-semibold mt-2 md:mt-0">{item.title}</h1>

                <p className="text-zinc-300 mt-2">
                  {(item.desc?.slice(0, 80) || "No description available")}...
                </p>
              </div>

              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 text-3xl font-semibold">{item.price}₹</h2>

                <button
                  className="bg-red-100 text-red-700 border-red-700 rounded p-2 ms-2 cursor-pointer"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  <MdDelete size={22} />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 text-2xl text-zinc-100 font-semibold">
            Total: {total}₹
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
