import mongoose from 'mongoose';
const OrderSchema= new mongoose.Schema({
    // one user can order one at a time inspite of taking multiple users we will select a user
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true,

    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'bookinfo',
        required:true
    },
    status:{
        type:String,
        default:"ORDER_PLACED",
     enum:[
  "ORDER_PLACED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
]
  
    },
    // timestamps are used to sort order in correct sequences


},
{ timestamps: true}
);
const OrderData=mongoose.model('OrderData',OrderSchema);
export default OrderData;