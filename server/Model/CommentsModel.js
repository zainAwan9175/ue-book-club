import mongoose from "mongoose";





const commentSchema=mongoose.Schema({
    user_id:{
        type:String,
        require:true,
    },
   book_id:{
    type:String,
    require:true,
   },
    content:{
        type:String,
        require:true,
    },
    waqt:{
        type:String,
        require:true,
    },
    avatar:{
        type:String,
        require:true,
    },
    likes: {
        type:Number,
        default:0,

    },
    user:{
        type:String,
        require:true,
    },
    parent_id: {
        type: String,
        default: null
      },
      replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
      }]


   
   


},{timestamps:true})

const commentModel=mongoose.model("comment",commentSchema)
export  default commentModel