import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  shippingInfo: {
    adress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  orderedItems: [
    {
      name: {
        type: String,
        required: true,
      },
      actualPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      producttotal:{
        type:Number,
        required:true
      },
      status: {
        type: String,
        required: true,
        default: "Processing",
      },
      statustime:{
        type:String
      },
      createdAt:{
        type:Date,
        default:Date.now
      },
      user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
      }
    },
  ],
  Name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paidAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
  },
  taxPrice: {
    type: Number,
  },
  ShippingPrice: {
    type: Number,
    default: 0,
  },
  totalprice: {
    type: Number,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});
const order = mongoose.model("Order", orderSchema);
export default order;
