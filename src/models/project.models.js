import mongoose,{Schema} from "mongoose";

const projectSchema  = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true,
        unique:true
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Project = mongoose.model("Project",projectSchema)