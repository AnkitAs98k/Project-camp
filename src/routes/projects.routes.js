import { Router } from "express";
import {
  //addMembersToProject,
createProjects,
  getProjects,
  getProjectbyId,
  updateProject,
  deleteProject,
  getProjectMember,
  updateMemberRole,
  deleteMember,
  addProjectMembers
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMembertoProjectValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, userRoleEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(validate, createProjects);


router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole),validate,getProjectbyId)
    .put(validateProjectPermission([userRoleEnum.admin]),validate,updateProject)
    .delete(validateProjectPermission([userRoleEnum.admin]),
            deleteProject
    );
router
    .route("/:projectId/members")
    .get(validateProjectPermission(AvailableUserRole),validate,getProjectMember)
    .post(validateProjectPermission([userRoleEnum.admin]),validate,addProjectMembers)


router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermission([userRoleEnum.admin]),validate,updateMemberRole)
    .delete(validateProjectPermission([userRoleEnum.admin]),validate,deleteMember)


export default router;