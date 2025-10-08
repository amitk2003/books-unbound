// src/components/Cart.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import emptyCart from '../assets/empty-cart.png';
import Loader from '../components/Loader/Loader.jsx';
import { MdDelete } from 'react-icons/md';
import { fetchCart, removeFromCart } from '../store/cart.js';

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cart, total, isLoading, error } = useSelector((state) => state.cart);
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  // Handle item deletion
  const handleDeleteItem = (id) => {
    dispatch(removeFromCart(id)).then((result) => {
      if (removeFromCart.fulfilled.match(result)) {
        alert(result.payload.message);
      } else {
        alert(result.payload || 'Failed to delete item');
      }
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && error && (
        <div className="h-screen px-12 py-8 bg-zinc-800">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">Error Loading Cart</h1>
            <p className="text-zinc-300 mt-4">{error}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && cart.length === 0 && (
        <div className="h-screen px-12 py-8 bg-zinc-800">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">Empty Cart</h1>
            <img src={emptyCart} alt="empty-cart" className="h-[50vh]" />
          </div>
        </div>
      )}
      {!isLoading && !error && cart.length > 0 && (
        <>
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
                <h1 className="text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                  {item.title}
                </h1>
                <p className="text-normal text-zinc-300 mt-2 hidden lg:block">
                  {item.desc.slice(0, 100)}...
                </p>
                <p className="text-normal text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {item.desc.slice(0, 50)}...
                </p>
                <p className="text-normal text-zinc-300 mt-2 block md:hidden">
                  {item.desc.slice(0, 100)}...
                </p>
              </div>
              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 text-3xl font-semibold flex">{item.price}₹</h2>
                <button
                  className="bg-red-100 text-red-700 border-red-700 rounded p-2 ms-2"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 text-2xl text-zinc-100 font-semibold">
            Total: {total}₹
          </div>
        </>
      )}
    </>
  );
};

export default Cart;