import express from 'express'
import User from '../model/User_schema.js';
const fav=express.Router();
import authToken from './userAuthtoken.js';

fav.put("/add-book-to-favourite", authToken, async(req,res)=>{
try {
    const {bookid,id}=req.headers;
    const userdata= await User.findById(id);
    // we will not add same book multiple times, need to make sure that add to favourite only 1 time
    const isBookFavourite= userdata.favourites.includes(bookid);
    if(isBookFavourite) return res.status(200).json({message:"book is already added to favourite"});
    await User.findByIdAndUpdate(id,{$push:{favourites:bookid}})
    return res.status(200).json({message:"book added to favourite successfully"});
} catch (error) {
     res.status(500).json({message:"Internal server error"});
    
}
})
//delete book from favourite
fav.delete("/delete-book-from-favourite",authToken,async(req,res)=>{
    try {
        const {bookid,id}=req.headers;
        const userdata= await User.findById(id);
        // we will not add same book multiple times, need to make sure that add to favourite only 1 time
        const isBookFavourite= userdata.favourites.includes(bookid);
        // we dont want to remove book from database we remporarily want to remove book from database
        if(isBookFavourite) {
            await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}})
        }
        
        return res.status(200).json({message:"book remove from favourite successfully"});
    } catch (error) {
         res.status(500).json({message:"Internal server error"});
        
    }
})
// now i dont want to add paricular book to unique paricular id 
// key points about  populate 
// if you not define populate then in favourite only i book id will retreive not 
fav.get("/get-favourite-books",authToken,async(req,res)=>{
    try{
        const {id }=req.headers;
        const user_data=await User.findById(id).populate("favourites");
        const favouriteBooks= user_data.favourites;
        return res.json({
            status:"success",
            data:favouriteBooks
            // why we send only data as favourite boks because if we pass whole data . there is chances of data loss
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"an error occured"});
    }
})
export default fav;