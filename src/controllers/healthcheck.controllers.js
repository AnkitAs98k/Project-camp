import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/aysncHandler.js";
/*
const healthcheck = (req,res) =>{
    try {
        res
        .status(200)
        .json(new ApiResponse(200,{message: "Successfull healthcheck"}));
    } catch (error) {
        
    }
}
*/
const healthcheck = asyncHandler(async(req,res)=>{
    res
    .status(200)
    .json(new ApiResponse(200,{message:"Succesfully cheacked"}))
});

export default healthcheck;