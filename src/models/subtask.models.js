import mongoose,{Schema} from "mongoose";

const subTaskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    subTaskoff:{
        type:Schema.type.ObjectId,
        ref:"Task"
    },
    descrption:{
        type:String,
        required:true,
        trim:true
    },
    createdBy:{
          type:Schema.type.ObjectId,
          ref:"User"  
    }
},{timestamps:true})


export const SubTask = mongoose.model("SubTask", subTaskSchema)