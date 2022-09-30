import mongoose from "mongoose"
const appliedpromoSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    appliedCodes:[
        {
            code:{
                type:String,
                required:true
            }
        }
    ]
})
const Appliedcodes=mongoose.model("Appliedcodes",appliedpromoSchema)
export default Appliedcodes;
