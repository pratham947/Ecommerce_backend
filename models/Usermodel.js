import mongoose from "mongoose";
import validator from "validator"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        validate: [validator.isEmail, "email is not true"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [8, "password should be greater than 8 character"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"User" 
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const usermodel=mongoose.model("User",userSchema);
export default usermodel;