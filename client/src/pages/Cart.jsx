// src/components/Cart.jsx
import React, { useEffect,useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import emptyCart from "../assets/empty-cart.png";
import Loader from "../components/Loader/Loader.jsx";
import { MdDelete } from "react-icons/md";
import { fetchCart, removeFromCart } from "../store/cart.js";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";


const Cart = () => {
  const dispatch = useDispatch();
  const { items: cart, total, isLoading, error } = useSelector((state) => state.cart);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [orderPlaced,setOrderPlaced]=useState(false)
  const [placingorder,setPlacingOrder] =useState(false)
  const navigate=useNavigate();
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

  const placeOrder=async()=>{
    
      try{
        setPlacingOrder(true)
        const res=await api.post(`/api/place-order`,{
          book_order:cart.map(item=>(
            {
              _id:item._id
            })
          )},{headers:{id:localStorage.getItem("id"),
        Authorization:`Bearer ${localStorage.getItem("token")}`}}
          
        )
        setOrderPlaced(true)
        alert(res.data.message || "order placed successfully")
      }catch(error){
        console.log(error)
        alert("failed to place order")
      }
      finally{
        setPlacingOrder(false)
      }
      dispatch(fetchCart())
     setTimeout(()=>{
      navigate('/profile/orderHistory')
     },4000) 

        // setOrderPlaced(res.data.message)

    
      // } catch(error){}
  }

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

          
          <div className="mt-10 w-full md:w-[60%] mx-auto bg-zinc-900 border border-zinc-700 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg">

  {/* Total Section */}
  <div className="flex flex-col text-center md:text-left">
    <span className="text-sm text-zinc-400 uppercase tracking-wide">
      Total Amount
    </span>
    <span className="text-3xl font-bold text-zinc-100 mt-1">
      ₹{total}
    </span>
  </div>

  {/* Action Section */}
  {!orderPlaced ? (
    <button
      onClick={placeOrder}
      disabled={placingorder}
      className={`mt-4 md:mt-0 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200
        ${
          placingorder
            ? "bg-zinc-600 cursor-not-allowed text-zinc-300"
            : "bg-green-600 hover:bg-green-500 text-white shadow-md hover:shadow-lg"
        }`}
    >
      {placingorder ? "Placing Order..." : "Place Order"}
    </button>
  ) : (
    <div className="mt-4 md:mt-0 text-green-500 text-lg font-semibold flex items-center gap-2">
      ✅ Order placed successfully
    </div>
  )}
</div>


        </div>
      )}
    </>
  );
};

export default Cart;
