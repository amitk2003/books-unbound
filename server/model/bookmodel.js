import {mongoose} from "mongoose"

const bookSchema=mongoose.Schema(
    {
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    PublicationYear:{
        type:Number,
        required:true,

    }
    },
    {
        timestamps:true,
    }
);
const book_data=mongoose.model('book_data',bookSchema);
export default book_data;

