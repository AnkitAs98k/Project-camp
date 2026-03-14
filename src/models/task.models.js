import mongoose, {Schema} from "mongoose";
import {taskStatusEnum, AvailableTaskStatus} from "../utils/constants.js"

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ofProject:{
        type:Schema.type.ObjectId,
        ref :"project",
    },
    assignedUser:{
        type:Schema.type.ObjectId,
        ref:"User"  
    },
   assignedBy:{
        type:Schema.type.ObjectId,
        ref:"User"  
    },
    taskStatus:{
        type:String,
        enum:AvailableTaskStatus,
       default:taskStatusEnum.todo,
    },
    attachment:{
        types:[{
                url:String,
                mimeType:String,
                size:Number
        }]
    },

    default: []
},{timestamps:true})

export const Task = mongoose.model("Task",taskSchema)