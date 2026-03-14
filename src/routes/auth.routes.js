import { Router } from "express"

import {registerUser} from "../controllers/auth.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { userRegsisterValidator } from "../validators/index.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { login } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(userRegsisterValidator(),validate,registerUser)

router.route("/login").post(login)


export default router;