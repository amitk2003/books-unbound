import mongoose from 'mongoose';
const OrderSchema= new mongoose.Schema({
    // one user can order one at a time inspite of taking multiple users we will select a user
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true,

    },
    books:[
        {
            book:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'bookinfo'
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    paymentType:{
        type:String,
        enum:["COD","ONLINE"],
        default:"COD",
    },
    paymentStatus:{
        type:String,
        enum:["Pending","Completed","Failed"],
        default:"Pending",
        

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
    deliveryOTP:{
        type:String,
    },
    otpExpiry:{
        type:Date,
    }

},
{ timestamps: true}
);
const OrderData=mongoose.model('OrderData',OrderSchema);
export default OrderData;