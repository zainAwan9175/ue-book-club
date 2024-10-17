import mongoose from "mongoose";

const commentSchema=mongoose.Schema({
    user_id:{
        type:String,
        require:true,
    },
   
    message:{
        type:String,
        require:true,
    }
   
   


},{timestamps:true})

const commentModel=mongoose.model("comment",commentSchema)
export  default commentModel