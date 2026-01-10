import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import type{ Request, Response } from "express";

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
    // const validatePassword = await existingUser.isPasswordCorrect(password)
}

export {
    signupUser
}