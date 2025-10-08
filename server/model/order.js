import mongoose from 'mongoose';
const OrderSchema= new mongoose.Schema({
    // one user can order one at a time inspite of taking multiple users we will select a user
    username:{
        type:mongoose.Types.ObjectId,
        ref:'User',

    },
    book:{
        type:mongoose.Types.ObjectId,
        ref:'bookinfo',
    },
    status:{
        type:String,
        default:"order placed",
        enum:["order placed","out for delivery","delivered successfully","cancelled","return"],
    },
    // timestamps are used to sort order in correct sequences


},
{ timestamps: true}
);
const OrderData=mongoose.model('OrderData',OrderSchema);
export default OrderData;