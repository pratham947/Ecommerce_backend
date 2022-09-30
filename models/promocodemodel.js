import mongoose from "mongoose"
const promocodeSchema=new mongoose.Schema({
    promocode:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    expired:{
        type:Boolean,
        default:false
    }
})


const Promocode=mongoose.model("Promocode",promocodeSchema)
export default Promocode;