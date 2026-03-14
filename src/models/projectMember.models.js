import mongoose,{Schema} from "mongoose";
import { AvailableUserRole,AvailableTaskStatus, userRoleEnum } from "../utils/constants.js";
import { User } from "./user.models.js";
import { Project } from "./project.models.js";

const projectMemberSchema = new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },
    project:{
        type: Schema.Types.ObjectId,
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