import type { Types } from "mongoose";
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import type{ Request, Response } from "express";

const generateAccessAndRefreshToken= async(userId:Types.ObjectId)=>{
    try{
        const user =  await User.findById(userId);
        if(!user){
            throw new ApiError(400, "user not found on accessing of generating access and refresh token for user auth")
        }

    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user?.save({validateBeforeSave : false});
    return { accessToken, refreshToken};
    }catch(error){
        throw new ApiError( 400, "something went wrong generating access and refresh token");
    }
}

const signupUser = async function (req:Request, res:Response) {
    const { username, email, password } = req.body;

    if(
        [ username, email, password ].some((field)=>field.trim()==="")
    ){
        throw new ApiError(400, "All fields are required");
    }

    try {
        const existedUser = await User.findOne({
        $or : [ {username}, {email}]
    })
    if(existedUser){
        throw new ApiError(402, "User already exist from this username or email");
    }
    const user = await User.create({
        username,
        email,
        password
    })
    const findUser = await User.findById(user._id);
    if(!findUser){
        throw new ApiError(402, "User not created in the database");
    }
    res.status(201).json({
        success : true,
        data : {
        id : findUser._id,
        username : findUser.username,
        email : findUser.email
        },
        message : "User Created Successfully"
    })
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "UserRegister controller not working due to some server issue")
    }
}

const loginUser = async function(req:Request, res:Response){
    const { username, email, password } = req.body;

    if(!email && !password){
        throw new ApiError(402, "Email & Password are mandatory");
    }
    
    const existingUser = await User.findOne({
        $or : [ {username}, {email}]
    })
    if(!existingUser){
        throw new ApiError(400, "User not found in login");
    }
    const verifyPassword = await existingUser.isPasswordValid(password);
    if(!verifyPassword){
        throw new ApiError(400, "Password is not matching");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id);
    const loggedInUser = await User.findById(existingUser._id).select("-password, -refreshToken");

    return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json({
        user: loggedInUser, accessToken, refreshToken,
        message : "User logged In Successfully"
    })
}

export {
    signupUser,
    loginUser
}