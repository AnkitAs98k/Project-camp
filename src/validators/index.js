import { body} from "express-validator"

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

export {userRegsisterValidator}