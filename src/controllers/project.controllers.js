import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectMember.models.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose"

/*const Projects = asyncHandler(async (req, res) => {
    //  `GET /`
    try {

        res.status(201).json({ Projects })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }


})
*/
const createProjects = asyncHandler(async (req, res) => {
    // `POST /
    
        const { title, content } = req.body;
        const existedProject = await Project.findOne({ title });
        if (existedProject) {
            req.status(400).json({ message: "project already present" })
        }

        const newProject = await Project.create({
            title,
            content,
            author:new mongoose.Types.ObjectId(req.user._id)
        });

        await ProjectMember.create({
                user: new mongoose.Types.ObjectId(req.user._id),
                project: new mongoose.Types.ObjectId(newProject._id),
                role: userRoleEnum.admin

        })

        
        res
        .status(201)
        .json(new ApiResponse(
            201,
            newProject,
            "Project succesfully created"
        ));
   
   
})


const updateProject = asyncHandler(async (req, res) => {
    const {title, content} = req.body;
    const projectId = req.params;

    await Project.findByIdAndUpdate(
        projectId,
        {
            title,
            content
        },
        {new:true}
    );

    if(!projectId){
        return res.status(404).json({message:"Id not found"});
    }

    res.status(200)
    .json(new ApiResponse(
        200,
        Project,
        "Updated succesfully"
    )
    )

})


const deleteProject = asyncHandler(async (req, res) => {
    //  `DELETE /:projectId`

    const {projectId} = req.params;
    await Project.findByIdAndDelete(projectId);
    

    if(!projectId){
        throw new ApiError(404,"project not found")
        }

    return res.status(200)
              .json(new ApiResponse(
                    200,
                    "Deleted"
              ))
})




const getProjectbyId = asyncHandler(async (req, res) => {

    //  `GET /:projectId

})




const getProjectMembers = asyncHandler(async (req, res) => {
    //  GET /:projectId/members
})

const addProjectMembers = asyncHandler(async (req, res) => {
    //  POST /:projectId/members
})

const updateMemberRole = asyncHandler(async (req, res) => {
    //  POST /:projectId/members
})

const removeProjectMembers = asyncHandler(async (req, res) => {
    //  POST /:projectId/members
})

export { createProjects,
        getProjectbyId,
        updateProject,
        deleteProject,
        getProjectMembers,
        updateMemberRole,
        removeProjectMembers,
        addProjectMembers
    };