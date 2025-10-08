import express from "express";
// AS EXPRESS is library and router is functionality of express thats why we are calling as express.router
import User from "../model/User_schema.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import authToken from "./userAuthtoken.js";
// const jwtsecret="rbgu4t76@#$%^&*()_)(*&^%$123vbnmkli87655";
import {OAuth2Client} from "google-auth-library";

const router=express.Router();
const googleClient=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post('/sign-up/google',async(req,res)=>{
    const {token}=req.body;
    if(!token) return res.status(400).json({success:false,error:'No token provided'});
    try{
        const ticket=await googleClient.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        })
        const payload=ticket.getPayload()
        const email=payload.email;
        let ExistingUser=await User.findOne({email})
        if(!ExistingUser) return res.status(400).json({success:false,message:"user already exists"});
        const user= await User.create({
            Username:payload.name,
            Email:payload.email,
            password:"",
            address:""
        })
        const jwtPayload={
            id:user._id,
            email:user.email,
            role:user.role
    }
     const authToken = jwt.sign(jwtPayload, "bookstore234", { expiresIn: "100d" });

    return res.status(200).json({
      id: user._id,
      role: user.role,
      token: authToken,
      success:true
    });
  } catch (error) {
    console.error("Google sign-up error", error.message,error.stack);
    return res.status(401).json({ success: false, error: "invalid google client id" });
  }
});
router.post('/sign-in/google',async(req,res)=>{

})
router.post("/sign-up",async(req,res)=>{
try{
    const {Username,Email,password,address}=req.body;
     if (!Username || !Email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }
    if(Username.length<4){
        return res.status(400).json({message:"Username length should be greater than 4"});
    }
    // 
    const existingUser= await User.findOne({Username});
    // Username:Username ,Username  compares name from database whether user is already taken or not
    if(existingUser){ 
        return res.status(400).json({message:"Username already exists"});
    }
    const existingEmail= await User.findOne({Email});
    // Username:Username ,Username  compares name from database whether user is already taken or not
    if(existingEmail){
         return res.status(400).json({message:"Email already exists"});
        }
    // check password length
    if(password.length<=5){
        return res.status(400).json({message:"password length should be greater than 5"});
    }
    const hash_password=await bcrypt.hash(password,10);
    console.log(hash_password);
    // for new user
    const NewUser =new User({
        Username:Username,
        Email:Email,
        password:hash_password,
        address:address,
    });
    await NewUser.save();
    res.status(200).json({message:"Sign UP Successfully"});
   
    console.log(NewUser);

}catch(error){
    res.status(500).json({success:"false",error:"Error during sign up"});
    console.error("Internal server error",error);
}
});
router.post("/login", async (req, res) => {
  try {
    const { Username, password } = req.body;

    const ExistingUser = await User.findOne({ Username });

    if (!ExistingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, ExistingUser.password);

     if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Payload should include the user's ID
    const payload = {
      id: ExistingUser._id,
      username: ExistingUser.Username,
      role: ExistingUser.role,
    };

    const token = jwt.sign(payload, "bookstore234", { expiresIn: "100d" });

    return res.status(200).json({
      id: ExistingUser._id,
      role: ExistingUser.role,
      token: token,
    });
  } catch (error) {
    console.error("Internal server error", error);
    return res.status(500).json({ success: false, error: "Error during login" });
  }
});

// use of auth token to get user data
router.get("/get-userInfo",authToken,async(req,res)=>{
    try {
const { id }=req.headers;
// we dont want to display password auth so we will use .select('-password')
const data =await User.findById(id).select('-password');
return res.status(200).json(data);


    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
});
// update address
// here also need to use authToken because we need to examaine only user whose data need to update
router.put("/update-Address",authToken,async(req,res)=>{
    try {
        const {id}=req.headers;
        const {address}=req.body;
        await User.findByIdAndUpdate(id,{address:address});
        return res.status(200).json({message:"Address updated successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"}); 
    }
})
router.put("/update-Email",authToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {Email}=req.body;
        await User.findByIdAndUpdate(id,{Email:Email});
        return res.status(200).json({message:"email updated successfully"});

    }catch(error){
        res.status(500).json({message:"internal server error"})
    }
})
router.put("/forget-password",authToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {new_password}=req.body;
        if(new_password.length<5){
            return res.status(400).json({message:"password length is not sufficent"})
        }

        const hashedPassword=await bcrypt.hash(new_password,10);

        //
        await User.findByIdAndUpdate(id,{password:hashedPassword});
        return res.status(200).json({message:"password updated successfully"});

    }catch(error){
        res.status(500).json({message:"internal server error"})
    }

})

export default router;

