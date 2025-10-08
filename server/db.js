import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL=process.env.Mongo_urL;
const connectDB= async()=>{
    if(!MONGO_URL){
        console.log("mongo db url not found");
        process.exit(1);
    }
    try{
        await mongoose.connect(MONGO_URL,{
            useNewUrlParser:true,
            UseUnifiedTopology :true,
        });
        console.log("mongo db connected successfully");

    }catch(error){
        console.error('error in connecting database to mongo db for fetching data ',error);
        process.exit(1);
    }
}
export default connectDB;