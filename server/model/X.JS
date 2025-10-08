import mongoose from 'mongoose'
const data= new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        unique:true,

    },
    Email:{
        type:String,
        required:true,
        unique:true,
    },
    Password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"c.jpg"
    },
    role:{
        type:String,
        default:"user",
        enum:["customer","admin"],
    },
    

},
{timestamps:true}
);

const ActualData=mongoose.model('data',data,'data');
// in mongodb atlas or mongo compass it wil create a collection named 'data' if you not write third param ,it will write collection name as plural form of word like datas
export default ActualData;