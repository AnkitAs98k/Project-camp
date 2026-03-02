
import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema(
    {
        avatar:{
            type:String
        },
        username:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index : true        
        },
        fullname:{
             type:String,
            require:true,  
        },
        email:{
             type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index : true   
        },
        password:{
            type: String,
            require: true
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String
        },
        forgetPasswordToken:{
            type:String
        },
        forgetPasswordExpiry:{
            type:Date
        },
        emailverificationToken:{
            type:String
        },
        emailverifcationExpiry:{
            type:Date
        }
    });
    
    userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

    userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

    userSchema.methods.generateAccessToken=function()
    {
        return jwt.sign(
            //payload will be defined 1st
            {
                _id : this._id,
                email:this.email,
                username:this.username,
                
            },
            //the 2nd part is the signature for the secret
            process.env.ACCESS_TOKEN_SECRET,
            process.env.ACCESS_TOKEN_EXPIRY
        )
    };



userSchema.methods.generateRefreshToken=function()
    {
        return jwt.sign(
            //payload will be defined 1st
            {
                _id : this._id,
                email:this.email,
             
                
            },
            //the 2nd part is the signature for the secret
            process.env.REFRESH_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_EXPIRY
        )
    }

    userSchema.methods.generateTemporaryToken = function()
    {
        const unHashedToken = crypto.randomBytes(20).toString("hex");

        //hash the unhashed token which is randomly generated
         
        const hashedToken = crypto
                             .createHash("sha256")
                            .update(unHashedToken)
                            .digest('hex');

        const tokenExpiry = Date.now()+(60*20*1000) //20mins
        return {hashedToken,unHashedToken,tokenExpiry}

    }

    export const User = mongoose.model("User", userSchema)