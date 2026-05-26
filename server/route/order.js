// import express from 'express'
// import User from '../model/User_schema.js';
// import authToken from './userAuthtoken.js';
// import Stripe from 'stripe';

// import OrderData from '../model/order.js';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const order_route = express.Router();


// order_route.post("/create-checkout-session", authToken, async(req,res)=>{

//     try{

//         const { books } = req.body;

//         const line_items = books.map(item=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.title
//                 },
//                 unit_amount:item.price * 100
//             },
//             quantity:item.quantity
//         }));

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types:["card"],
//             line_items,
//             mode:"payment",
//             success_url:"http://localhost:5173/success",
//             cancel_url:"http://localhost:5173/cancel"
//         });

//         res.json({id:session.id});

//     }catch(error){
//         console.log(error);
//         res.status(500).json({message:"Stripe error"});
//     }

// });

// order_route.post("/place-order", authToken, async (req,res)=>{

//     try{

//         const { id } = req.headers;
//         const { books, paymentType } = req.body;

//         const order = new OrderData({
//             userId:id,
//             books:books,
//             paymentType:paymentType,
//             paymentStatus: paymentType==="ONLINE" ? "Completed" : "Pending"
//         });

//         const savedOrder = await order.save();

//         await User.findByIdAndUpdate(id,{
//             $push:{order:savedOrder._id},
//             $pull:{cart:{_id:{$in:books.map(item=>item.book)}}}
//         });

//         res.json({
//             status:"success",
//             message:"Order placed successfully",
//             orderId:savedOrder._id
//         });

//     }catch(error){
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }

// });

// // admin generates otp when order becomes out for delivery
// order_route.post("/generate-delivery-otp/:id", async(req,res)=>{

//     try{

//         const { id } = req.params;

//         const order = await OrderData.findById(id);

//         if(order.paymentType !== "COD"){
//             return res.json({message:"OTP only for COD orders"});
//         }

//         const otp = Math.floor(100000 + Math.random()*900000).toString();

//         order.deliveryOTP = otp;
//         order.otpExpiry = Date.now() + 10*60*1000;

//         await order.save();

//         res.json({
//             message:"Delivery OTP generated",
//             otp
//         });

//     }catch(error){
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }

// });
// // verify otp by delivery person
// order_route.post("/verify-delivery-otp", async(req,res)=>{

//     try{

//         const { orderId, otp } = req.body;

//         const order = await OrderData.findById(orderId);

//         if(order.deliveryOTP !== otp){
//             return res.status(400).json({message:"Invalid OTP"});
//         }

//         if(order.otpExpiry < Date.now()){
//             return res.status(400).json({message:"OTP expired"});
//         }

//         order.status = "DELIVERED";
//         order.deliveryOTP = null;

//         await order.save();

//         res.json({
//             message:"Order delivered successfully"
//         });

//     }catch(error){
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }

// });
// // get order history of particular user
// order_route.get("/get-order-history", authToken, async(req,res)=>{
//     try {
//         const {id}= req.headers;
//         if(!id){
//             return res.status(400).json({message:"user id is missing in  headers "})
//         }
//         const user_info= await User.findById(id).populate({
//             path:"order",
//             populate:{ path: "book"}
//         });
//         if(!user_info){
//             return res.status(404).json({message:"user not found"})
//         }
//         // const order_data= user_info.order.reverse();
//         return res.json({
//             status:"success",
//             data:[...user_info.order].reverse()
//         })
//     } catch (error) {
//         console.log("Get order History", error);
//         return res.status(500).json({message:"internal server error"})
//     }
// })
// // order history of admin
// order_route.get("/get-all-orders", authToken, async(req,res)=>{
//     try {
//         const userData= await OrderData.find().populate({
//             path:"book",
//         }).populate({path:"user"}).sort({createdAt:-1});
//         return res.json({
//             status:"success",
//             data:userData
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"internal server error"})
//     }
// });
// // update order --admin
// order_route.put("/update-status/:id", authToken, async(req,res)=>{
//     try {

//         const { id }= req.params;
//         const person= await User.findById({id});
//         if(person.role==='admin'){
//             await OrderData.findByIdAndUpdate(id,{status: req.body.status});
//             return res.json({
//                 status:"success",
//                 message:"status updated successfully"
//             })
//         }
//         else{
//             return res.status(401).json({message:"this updation can't be performed"});
//         }
       
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"an error occured"});
//     }
// })





// export default order_route;
import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";

import User from "../model/User_schema.js";
import OrderData from "../model/order.js";
import authToken from "./userAuthtoken.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const order_route = express.Router();


// =============================
// STRIPE CHECKOUT SESSION
// =============================
order_route.post("/create-checkout-session", authToken, async (req, res) => {

  try {

    const { id } = req.headers;
    const { books } = req.body;

    const line_items = books.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      metadata: {
        userId: id,
        books: JSON.stringify(books)
      },

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel"

    });

    res.json({ id: session.id });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Stripe session error" });

  }

});


// =============================
// STRIPE WEBHOOK (PAYMENT VERIFY)
// =============================
order_route.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {

    const sig = req.headers["stripe-signature"];

    let event;

    try {

      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

    } catch (err) {

      console.log("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);

    }

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      const userId = session.metadata.userId;
      const books = JSON.parse(session.metadata.books);

      const order = new OrderData({
        userId,
        books,
        paymentType: "ONLINE",
        paymentStatus: "Completed"
      });

      const savedOrder = await order.save();

      await User.findByIdAndUpdate(userId, {
        $push: { order: savedOrder._id },
        $pull: { cart: { _id: { $in: books.map(item => item.book) } } }
      });

      console.log("Order created after Stripe payment");

    }

    res.json({ received: true });

  }
);


// =============================
// COD ORDER PLACEMENT
// =============================
order_route.post("/place-order-cod", authToken, async (req, res) => {

  try {

    const { id } = req.headers;
    const { books } = req.body;

    const order = new OrderData({

      userId: id,
      books,
      paymentType: "COD",
      paymentStatus: "Pending"

    });

    const savedOrder = await order.save();

    await User.findByIdAndUpdate(id, {
      $push: { order: savedOrder._id },
      $pull: { cart: { _id: { $in: books.map(item => item.book) } } }
    });

    res.json({
      status: "success",
      message: "COD order placed successfully",
      orderId: savedOrder._id
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "server error" });

  }

});


// =============================
// GENERATE DELIVERY OTP (COD)
// =============================
order_route.post("/generate-delivery-otp/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const order = await OrderData.findById(id);

    if (order.paymentType !== "COD") {
      return res.json({ message: "OTP only for COD orders" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    order.deliveryOTP = otp;
    order.otpExpiry = Date.now() + 10 * 60 * 1000;

    await order.save();

    res.json({
      message: "Delivery OTP generated",
      otp
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "server error" });

  }

});


// =============================
// VERIFY DELIVERY OTP
// =============================
order_route.post("/verify-delivery-otp", async (req, res) => {

  try {

    const { orderId, otp } = req.body;

    const order = await OrderData.findById(orderId);

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (order.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    order.status = "DELIVERED";
    order.deliveryOTP = null;

    await order.save();

    res.json({
      message: "Order delivered successfully"
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "server error" });

  }

});


// =============================
// USER ORDER HISTORY
// =============================
order_route.get("/get-order-history", authToken, async (req, res) => {

  try {

    const { id } = req.headers;

    const user = await User.findById(id).populate({
      path: "order",
      populate: { path: "books.book" }
    });

    res.json({
      status: "success",
      data: [...user.order].reverse()
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "internal server error" });

  }

});


// =============================
// ADMIN GET ALL ORDERS
// =============================
order_route.get("/get-all-orders", authToken, async (req, res) => {

  try {

    const orders = await OrderData.find()
      .populate("books.book")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: orders
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "internal server error" });

  }

});


// =============================
// ADMIN UPDATE ORDER STATUS
// =============================
order_route.put("/update-status/:id", authToken, async (req, res) => {

  try {

    const { id } = req.params;
    const { userId } = req.headers;

    const admin = await User.findById(userId);

    if (admin.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await OrderData.findByIdAndUpdate(id, {
      status: req.body.status
    });

    res.json({
      status: "success",
      message: "Order status updated"
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "server error" });

  }

});


export default order_route;