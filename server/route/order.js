import express from 'express'
import User from '../model/User_schema.js';
import authToken from './userAuthtoken.js';

import OrderData from '../model/order.js';

const order_route = express.Router();
order_route.post("/place-order",authToken, async(req,res)=>{
    try {
        const {id} = req.headers;
    const {book_order }= req.body;
    const orderIds=[];
    for( const order_info of book_order){
        const new_order = new OrderData({ userId:id, book: order_info._id});
        const savedOrder= await new_order.save();
        orderIds.push(savedOrder._id);

        // save order in user model
        await User.findByIdAndUpdate(id,{
            $push:{order:{$each:orderIds}},
            $pull:{cart:{_id:{$in:book_order.map(item =>item._id)}}}
        })
        // clearing cart
       
        return res.json({
            status:"success",
            message:"order placed successfully"
        });

    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"})
    }

    
    
});
// get order history of particular user
order_route.get("/get-order-history", authToken, async(req,res)=>{
    try {
        const {id}= req.headers;
        if(!id){
            return res.status(400).json({message:"user id is missing in  headers "})
        }
        const user_info= await User.findById(id).populate({
            path:"order",
            populate:{ path: "book"}
        });
        if(!user_info){
            return res.status(404).json({message:"user not found"})
        }
        // const order_data= user_info.order.reverse();
        return res.json({
            status:"success",
            data:[...user_info.order].reverse()
        })
    } catch (error) {
        console.log("Get order History", error);
        return res.status(500).json({message:"internal server error"})
    }
})
// order history of admin
order_route.get("/get-all-orders", authToken, async(req,res)=>{
    try {
        const userData= await OrderData.find().populate({
            path:"book",
        }).populate({path:"user"}).sort({createdAt:-1});
        return res.json({
            status:"success",
            data:userData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"})
    }
});
// update order --admin
order_route.put("/update-status/:id", authToken, async(req,res)=>{
    try {

        const { id }= req.params;
        const person= await User.findById({id});
        if(person.role==='admin'){
            await OrderData.findByIdAndUpdate(id,{status: req.body.status});
            return res.json({
                status:"success",
                message:"status updated successfully"
            })
        }
        else{
            return res.status(401).json({message:"this updation can't be performed"});
        }
       
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"an error occured"});
    }
})





export default order_route;