import express from "express";
import User from "../model/User_schema.js"
import authToken from "./userAuthtoken.js";

import bookinfo from "../model/book.js";
const book=express.Router();


// add book: admin role
// book will added by user or admin so we need authenticatte token
book.post("/add-book",authToken,async(req,res)=>{
    // to check user is admin or normal user
    // need to check whether user or admin is adding book

    try {
        const { id}=req.headers;
        // while adding we need to check whether user is admin or not, who is adding book
        const person=await User.findById(id);
        if(person.role!=='admin'){
            // because update,add options applicable to admin only
            return res.status(400).json({message :"you don't have access to perform admin task"})
        }
        const book= new bookinfo({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language
        });
        console.log(req.body)
        await book.save();
        console.log(book);
        res.status(200).json({message:"books added successfully"})


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"});
    }
});
// insert many books at a time 
book.post("/add-multiple-books", async (req, res) => {
    try {
        const { id } = req.headers;

        // Check if the user is an admin
        const person = await User.findById(id);
        if (person.role !== "admin") {
            return res.status(400).json({ message: "You don't have access to perform admin tasks" });
        }

        // Ensure req.body is an array
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Expected an array of books" });
        }

        // Insert multiple books at once
        const books = await bookinfo.insertMany(req.body);

        console.log("Books added:", books);
        res.status(200).json({ message: "Books added successfully", books });

    } catch (error) {
        console.error("Error adding books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

book.put("/update-book", authToken,async(req,res)=>{
    
    try {
        const { book_id}=req.headers;
       
        await bookinfo.findByIdAndUpdate(book_id,{
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language
        });
        return res.status(200).json({message:"books updated successfully"})


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"});
    }
})
book.delete("/delete-book",async(req,res)=>{
    try {
        const { book_id}=req.headers;
       
        await bookinfo.findByIdAndDelete(book_id,{
            url:req.body.url,
            
        });
        return res.status(200).json({message:"books Deleted successfully"})


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"});
    }
})
book.get("/get-all",async(req,res)=>{
   // reason to add all books
   try{
    const books=await bookinfo.find().sort({createdAt: -1});
   return res.json({ status:"success", data:books});

   }catch(error){
    console.log(error);
    return res.status(500).json({message:"error occured"});
   }
   

});
// get all books with certain limit
book.get("/get-recent-book",async(req,res)=>{
    // reason to add all books
    try{
     const books=await bookinfo.find().sort({createdAt: -1}).limit(4);
    return res.json({ status:"success", data:books});
 
    }catch(error){
     console.log(error);
     return res.status(500).json({message:"error occured"});
    }
    
 
 });
 // get book by id
//  here colon denotes to add id of book_id
book.get("/get-book-by-id/:id", async(req,res)=>{
    try{
        const {id} =req.params;
        const book= await bookinfo.findById(id);
        return res.json({ status:"success", data:book});
    
       }catch(error){
        console.log(error);
        return res.status(500).json({message:"error occured"});
       }
})

export default book;

 




