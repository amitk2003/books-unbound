import express from "express"
import dotenv from "dotenv";
import bodyParser from "body-parser"
import connectDB from "./db.js";
import book from "./route/book.js"
import fav from "./route/faviourite.js"
import cart_route from "./route/cart.js";
import order_route from "./route/order.js"
import cors from "cors"
import router from "./route/user_credentials.js";
const app=express();
dotenv.config();

const port=process.env.PORT;
connectDB();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173", // Change this to your frontend URL
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
// to access backend url resources
app.get("/",(req,res)=>{
    return res.status(200).send("welcome to book store app");
    // console.log("welcome to book store app");
})
app.use("/api",router);
app.use("/api",book);
// app.use("/api",book1);
app.use("/api",fav);
app.use("/api",cart_route);
app.use("/api",order_route);



app.listen(port,()=>{
    console.log(`server connected successfully at port ${port}`)
})