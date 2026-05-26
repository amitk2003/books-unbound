import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {useSelector,useDispatch} from "react-redux";
import { fetchCart, removeFromCart } from "../store/cart"
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"
import Loader from "../components/Loader/Loader";
import emptyCart from "../assets/empty-cart.png";
const stripePromise = loadStripe("pk_test_51SEQGdH9izPYCzplfJ5wNqxCa6B2jZQeuYaliyYyqxvWAPINDCC5ILrDXLOruOnCvNOhEXFr6XTn6wiU2XuEaszW00wrsR8SLl");

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cart, total, isLoading, error } = useSelector((state) => state.cart);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  const handleDeleteItem = (id) => {
    dispatch(removeFromCart(id)).then((res) => {
      if (removeFromCart.fulfilled.match(res)) {
        alert(res.payload.message || "Item removed from cart");
      }
    });
  };

  const handleStripePayment = async () => {
    try {
      setPlacingOrder(true);
      const res = await api.post("/api/create-checkout-session", {
        books: cart.map(item => ({
          book: item._id,
          title: item.title,
          price: item.price,
          quantity: 1
        }))
      }, {
        headers: {
          id: localStorage.getItem("id"),
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: res.data.id
      });

      if (error) alert(error.message);
    } catch (err) {
      alert("Checkout error. Try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCODPayment = async () => {
    try {
      setPlacingOrder(true);
      await api.post("/api/place-order-cod", {
        books: cart.map(item => ({
          book: item._id,
          quantity: 1
        }))
      }, {
        headers: {
          id: localStorage.getItem("id"),
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Order Placed Successfully!");
      dispatch(fetchCart());
      navigate("/profile/orderHistory");
    } catch (err) {
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (isLoading) return <div className="h-screen bg-zinc-900 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="bg-zinc-950 min-h-screen py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-500 mb-12 text-center"
        >
          Your Cart
        </motion.h1>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 shadow-2xl"
          >
            <img src={emptyCart} alt="Empty" className="h-64 mb-8 opacity-20 grayscale" />
            <h2 className="text-3xl text-zinc-500 font-bold">Your cart is feeling light...</h2>
            <button 
              onClick={() => navigate("/all-books")}
              className="mt-8 px-8 py-3 bg-yellow-500 text-zinc-900 font-black rounded-full hover:scale-110 transition-transform shadow-xl shadow-yellow-500/10"
            >
              Start Discovering
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="lg:w-2/3 space-y-6">
              <AnimatePresence mode='popLayout'>
                {cart.map((item, i) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ x: -100, opacity: 0, rotateZ: -5 }}
                    animate={{ x: 0, opacity: 1, rotateZ: 0 }}
                    exit={{ x: 100, opacity: 0, rotateZ: 5 }}
                    whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2, z: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 group hover:border-yellow-500/30 transition-all shadow-xl"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="w-24 h-32 flex-shrink-0 relative overflow-hidden rounded-lg shadow-lg" style={{ transform: "translateZ(30px)" }}>
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-grow text-center md:text-left" style={{ transform: "translateZ(20px)" }}>
                      <h3 className="text-xl font-bold text-zinc-100 mb-1">{item.title}</h3>
                      <p className="text-zinc-500 text-sm line-clamp-2">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-6" style={{ transform: "translateZ(30px)" }}>
                      <span className="text-2xl font-black text-yellow-100">₹{item.price}</span>
                      <button 
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all transform active:scale-90"
                      >
                        <MdDelete size={24} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Checkout Card - 3D Perspective */}
            <div className="lg:w-1/3">
              <motion.div 
                initial={{ rotateX: 20, y: 100, opacity: 0 }}
                animate={{ rotateX: 0, y: 0, opacity: 1 }}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-3xl border border-zinc-700 shadow-2xl sticky top-8 text-white overflow-hidden"
                style={{ perspective: "1000px" }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <h2 className="text-3xl font-black mb-8 border-b border-zinc-700 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-green-500 font-bold uppercase tracking-widest text-xs">Free</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black text-zinc-100 pt-4 border-t border-zinc-700">
                    <span>Total</span>
                    <span className="text-yellow-100">₹{total}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStripePayment}
                    disabled={placingOrder}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {placingOrder ? "Initializing..." : (
                      <><span className="text-xl">💳</span> Pay with Stripe</>
                    )}
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCODPayment}
                    disabled={placingOrder}
                    className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-4 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <span className="text-xl">📦</span> Cash on Delivery
                  </motion.button>
                </div>
                
                <p className="text-center text-zinc-500 text-xs mt-6 tracking-wide uppercase font-bold">
                  Secure 256-bit SSL checkout
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
