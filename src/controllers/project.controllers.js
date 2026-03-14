import { Project } from "../models/project.models.js";

import { asyncHandler } from "../utils/aysncHandler.js";


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
    
        const { title, content, author } = req.body;
        const existedProject = await Project.findOne({ title });
        if (existedProject) {
            req.status(404).json({ message: "project already present" })
        }

        const newProject = await Project.create({
            title,
            content,
            author
        })
        res.status(201).json({ newProject });
   
   
})

const getProjectbyId = asyncHandler(async (req, res) => {

    //  `GET /:projectId
    
    // we are finding this by    
    const projectId = req.params;
    if(!projectId){
        return res.status(404).json({message:"MissedID"})
    }
    const project = await Project.findById(projectId);
    if(!project){
        res.status(404).json({
            message:"projct not  found"
        })
    }
    res.status(201).json({project}) 
})

const updateProject = asyncHandler(async (req, res) => {
    // PUT /:projectId
})

const deleteProject = asyncHandler(async (req, res) => {
    //  `DELETE /:projectId`
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