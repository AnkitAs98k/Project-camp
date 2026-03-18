import Mongoose from "mongoose";

import { ProjectMember } from "../models/projectMember.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/aysncHandler";

export const validateProjectPermission = (roles = []) => asyncHandler(async(req,res,next)=>{

    const {projectId} = req.params;
    if(!projectId){
        throw error(new ApiError(404,"Project not found"))
        
    };

    const project = await ProjectMember.findOne(
        user = new Mongoose.Types.ObjectId(req.user._id),
        project = new Mongoose.Types.ObjectId(projectId)
    )

    if(!project){
        throw error(new ApiError(404,"Project not found"))
    };

    const giveRole = ProjectMember?.roles;
    if(!req.user.roles .includes(giveRole)){
        throw new ApiError(404,
                "You are not able to acces this property"
        )
    }

    next();
})