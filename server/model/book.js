import mongoose from 'mongoose';
const book= new mongoose.Schema({
url:{
    type:String,
    required:true,
},
title:{
    type:String,
    required:true,
},
author:{
    type:String,
    required:true,
},
price:{
    type:Number,
    required:true,
},
desc:{
    type:String,
    required:true,

},
language:{
    type:String,
    required:true,
},
genre: {
    type: String,
    required: true,
    default: "Fiction",
},
stock: {
    type: Number,
    required: true,
    default: 10,
},
rating: {
    type: Number,
    default: 4.5,
},
reviews_count: {
    type: Number,
    default: 0,
},
},
{ timestamps: true}
);
const bookinfo=mongoose.model('bookinfo',book);
export default bookinfo;