import mongoose from "mongoose";
const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  Products: [
    {
        productId:{
            type: mongoose.Schema.Types.ObjectId
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
            type:Number,
            requrired:true
        }
    }
  ],
});
const History=mongoose.model("History",historySchema)
export default History;
