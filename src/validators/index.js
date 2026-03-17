import { body} from "express-validator"

import { AvailableUserRole } from "../utils/constants.js"

const userRegsisterValidator = () => {
    return [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Not in email format")
            .notEmpty()
            .withMessage("Email feild is not present"),
        body("username")
            .trim()
            .isLowercase()
            .withMessage("Should be in lowercase")
            .notEmpty()
            .withMessage("username feild should not be empty")
            .isLength({min:3})
            .withMessage("Should be greater than 3"),
        body("password")
            .trim()
            .isLength({min:5})
            .withMessage("Should be greater than 5" )
            .notEmpty()
            .withMessage("password Should not be empty")
    ]
}


const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};


export {userRegsisterValidator, addMembertoProjectValidator,createProjectValidator}