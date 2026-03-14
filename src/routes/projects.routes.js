import { Router } from "express"
import { Project } from "../models/project.models.js";
import { createProjects,getProjectbyId } from "../controllers/project.controllers.js";
const router = Router();



router.route("/").post(createProjects);
router.route("/").get(getProjectbyId);
export default router;