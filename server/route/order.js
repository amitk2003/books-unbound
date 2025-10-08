import express from 'express'
import User from '../model/User_schema.js';
import authToken from './userAuthtoken.js';
import orders from '../model/order.js';

const order_route = express.Router();
order_route.post("/place-order",authToken, async(req,res)=>{
    try {
        const {id} = req.headers;
    const {order }= req.body;
    for( const order_info of order){
        const new_order = new orders({ user:id, book: order_info._id});
        const orderDataFromDb= await new_order.save();
        // save order in user model
        await User.findByIdAndUpdate(id,{
            $push:{orders:orderDataFromDb._id}
        })
        // clearing cart
        await User.findByIdAndUpdate(id,{
            $pull:{cart:order_info._id},

        });
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
        const user_info= await User.findById(id).populate({
            path:"order",
            populate:{ path: "books"}
        });
        const order_data= user_info.order.reverse();
        return res.json({
            status:"success",
            data:order_data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"})
    }
})
// order history of admin
order_route.get("/get-all-orders", authToken, async(req,res)=>{
    try {
        const userData= await orders.find().populate({
            path:"books",
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
            await orders.findByIdAndUpdate(id,{status: req.body.status});
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