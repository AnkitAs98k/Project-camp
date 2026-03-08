/*
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/aysncHandler.js"
import { User} from "../models/user.models.js"
import { sendEmail } from "../utils/mail.js"

//Acess and refresh token are generate once the user s verified, hence it is constructed outside 
//the t
const genereateAccessAndRefreshToken = async(userId) =>{
        try {
            const user = await User.findById(userId);
            const refreshToken = user.generateRefreshToken();
            const accessToken = user.generateAccessToken();
            user.refreshToken =  refreshToken;
            await user.save({validateBeforeSave:false});
            return {accessToken,refreshToken}
        } catch ( error) {
            throw new ApiError(
                500,
                {message:"Something went wrong"}
            )
        }
    }

const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password,role} = req.body;

    const existedUser = await User.findOne({
        $or :[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User alreaady existed");   
    }
    

    //we have to add welements to user ,create user
    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified : false
    })
    const {hashedToken,unHashedToken,tokenExpiry} = 
        user.generateTemporaryToken();

        user.emailverificationToken=hashedToken;
        user.emailverifcationExpiry=tokenExpiry;

        await user.save({validateBeforeSave:false});

        await sendEmail({
          email: user?.email,
              subject: "Please verify your email",
              mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
              ),
            });
          

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken -emailverificationToken -emailverifcationExpiry"
        )

        if(!createdUser){
            throw new ApiError(404,"user not created cant aunthetify")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
            200,
            {user:createdUser},
            "User is created succesfully"
        ));

})

export {registerUser}

*/

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { User } from "../models/user.models.js";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";
import { cookie } from "express-validator";


//generating access and resfresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(
            500,
            "Error while generating access and refresh tokens"
        );
    }
};




const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, fullname } = req.body;

    // check existing user
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // create user
    const user = await User.create({
        username,
        email,
        password,
        fullname,
        isEmailVerified: false
    });

    // generate verification token
    const { hashedToken, unHashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    user.emailverificationToken = hashedToken;
    user.emailverifcationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    // send verification email
    await sendEmail({
        email: user.email,
        subject: "Verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    });

    // remove sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailverificationToken -emailverifcationExpiry"
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            { user: createdUser },
            "User registered successfully. Please verify email."
        )
    );
});



/*
    1. retrived thee data from the databse using const {...} = req.body
    2. checked if data is presernt or not by cheaking if(!email)
    3. cheacked if password matched or not by isPasswordCorrect fucniton inside user
    4. created refresh and acess token and send it to cookies and removing the sensitive data from the user

*/





const login = asyncHandler(async(req,res)=>{

        //retrived the data
        const {email,username,password} = req.body;

        //checked if the feilds are there or not
        if( !email ) {
            throw new ApiError(404,"feilds are missing")
        }

        //cheacking if user exists
        const user = await User.findOne({email})

        if(!user) {
            throw new ApiError(404, "user not found")
        }

        //cheack if passsword is correct
        const passwordvalid = await user.isPasswordCorrect(password);
        if(!passwordvalid){
            throw new ApiError(404,"Password is incorrect")
        }
        
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

        const userLoggedIn = await User.findById(user._id).select(
        "-password -refreshToken -emailverificationToken -emailverifcationExpiry"
        )

        const option ={
            httpOnly: true,
            secure: true

        }
        return res
                .status(200)
                .cookie("accessToken",accessToken,option)
                .cookie("refreshToken",refreshToken,option)
                .json(
                     new ApiResponse(
                        200,
                        {
                        user: userLoggedIn,
                        accessToken,
                        refreshToken,
                        },
                        "user loggen In succesfully"

                )
            )
});





export {
    registerUser,
    login

}