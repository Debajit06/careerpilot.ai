import mongoose from "mongoose";

const useSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"user already taken"],
        required:true
    },
    email:{
        type:String,
        unique:[true,"email already taken"],
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


const useModel= mongoose.model("User",useSchema)

export default useModel;