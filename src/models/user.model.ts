import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { ApiError } from "../utils/ApiError.ts";
dotenv.config({path : "../../.env"});

export interface UserSchema{
    username : string;
    email : string;
    password : string;
    websites : Schema.Types.ObjectId;
    refreshToken : string;
}

export interface UserMethods{
    isPasswordValid(password:string) : boolean;
    generateAccessToken() : string;
    generateRefreshToken() : string;
}

export interface UserDocument extends UserSchema, UserMethods, Document{}
const userSchema = new Schema<UserDocument>(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            index : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },
        password : {
            type : String,
            required : [ true, "Password is required"]
        },
        websites : {
            type : Schema.Types.ObjectId,
            ref : "Website"
        },
        refreshToken : {
            type : String
        }
    },{
        timestamps : true
    }
)

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(password:string) {
   return await bcrypt.compare(password, this.password)
}

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;
if(!ACCESS_TOKEN_SECRET && !REFRESH_TOKEN_SECRET){
    throw new ApiError(402, "Env varibales are not loading");
}

userSchema.methods.generateAccessToken = function():string{
    return jwt.sign({
        id : this._id,
        username : this.username,
        email : this.email
    },  //@ts-ignore
        ACCESS_TOKEN_SECRET ,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function():string{
    return jwt.sign({
        id : this._id
    },  //@ts-ignore
        REFRESH_TOKEN_SECRET ,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
)
}
export const User = mongoose.model<UserDocument>("User", userSchema);