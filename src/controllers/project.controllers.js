import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectMember.models.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import mongoose, { Mongoose } from "mongoose"
import { AvailableUserRole, userRoleEnum } from "../utils/constants.js";
import { User } from "../models/user.models.js";

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


const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "projects",
        foreignField: "_id",
        as: "projects",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "projects",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          content: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});



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
    //  GET /:projectId/members
    const { projectId } = req. params;
    const project = await Project.findById(project._id);
    if(!project){
        throw new ApiError(404,"Id not found");
    }

    return res.status(201)
            .json(new ApiResponse(
                200,
                project,
                "project fetched succesfully"
            ))
})


const getProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user", // better than $arrayElemAt
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, projectMembers, "Members fetched successfully")
  );
});


const addProjectMembers = asyncHandler(async (req, res) => {
    //  POST /:projectId/members

    const { email, role } =  req.body;
    const{projectId} = req.params;

    if(!email || !role){
        throw new ApiError(400, "Missing inputs")
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(500, "user not found")
    }

    await ProjectMember.findByIdAndUpdate(
        {        
            user: new Mongoose.Types.ObjectId(user.id),
            Projects: new Mongoose.Types.ObjectId(projectId)
        },{
            user: new Mongoose.Types.ObjectId(user.id),
            Projects: new Mongoose.Types.ObjectId(projectId),
            role:role
        },{
            new:true,
            upsert:true
        }
    )

    return res.status(201)
              .json(
                new ApiResponse(
                    200,
                    {},
                    "updates members"
                )
              )


})

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid Role");
  }

  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  projectMember = await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    {
      role: newRole,
    },
    { new: true },
  );

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member role updated successfully",
      ),
    );
});


const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  projectMember = await ProjectMember.findByIdAndDelete(projectMember._id);

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member deleted successfully",
      ),
    );
});


export { createProjects,
        getProjects,
        getProjectbyId,
        updateProject,
        deleteProject,
        getProjectMember,
        updateMemberRole,
       deleteMember,
        addProjectMembers
    };