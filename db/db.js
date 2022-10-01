import mongoose from "mongoose";

const connectToDatabase=()=>{
    mongoose.connect(process.env.MONGO_URI,()=>{
        console.log("database connected");
    })  
}

export default connectToDatabase;
