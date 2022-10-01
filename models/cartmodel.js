import mongoose from "mongoose"
const cartSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  Products:[
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
      },
      url:{
        type:String,
        required:true
      },
      name:{
        type:String,
        required:true
      },
      quantity:{
        type:String,
        required:true
      },
      producttotal:{
        type:Number,
        required:true
      },
      stock:{
        type:Number,
        required:true
      },
      actualPrice:{
        type:Number,
        required:true
      }
    }
  ],
  carttotal:{
    type:Number,
    required:true
  }
})
const Cart=mongoose.model("Cart",cartSchema)
export default Cart;