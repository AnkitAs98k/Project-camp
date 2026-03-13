import mongoose,{Schema} from "mongoose";
import { AvailableUserRole,AvailableTaskStatus, userRoleEnum } from "../utils/constants";
import { User } from "./user.models";
import { Projectroject } from "./project.models.js";

const projectMemberSchema = new mongoose.Schema({
    user:{
        type:Schema.type.ObjectId,
        ref:"User",
        unique:true
    },
    project:{
        type:Schema.type.ObjectId,
        ref:"project",
        unique:true
    },
    roles:{
        type:String,
        enum:AvailableUserRole,
        userRoleEnum:userRoleEnum.member
    }
})

export const ProjectMember  = mongoose.model("projectMember",projectMemberSchema)