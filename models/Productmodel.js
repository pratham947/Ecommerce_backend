import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"product name is required"]
    },
    description:{
        type:String,
        required:[true,"product description is required"]
    },
    price:{
        type:Number,
        required:[true,"price is required"]
    },
    ratings:{
        type:Number,
        default:0
    },
    image:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"please enter proudct stock"],
        default:1
    },
    numberofreviews:{
        type:String,
        default:0
    },
    reviews:[
        {
            profile:{
                type:String,
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
            }
        }
    ],
    brand:{
        type:String,
        required:[true,"brand name is required"]
    } 
    ,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Product=mongoose.model("Product",productSchema)
export default Product;