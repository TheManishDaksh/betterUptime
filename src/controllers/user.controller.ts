import type { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import type { Request, Response } from "express";

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(400, "user not found on accessing of generating access and refresh token for user auth")
        }

        const accessToken = user?.generateAccessToken();
        const refreshToken = user?.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user?.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(400, "something went wrong generating access and refresh token");
    }
}

const signupUser = async function (req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (
        [username, email, password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    try {
        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (existedUser) {
            throw new ApiError(402, "User already exist from this username or email");
        }
        const user = await User.create({
            username,
            email,
            password
        })
        const findUser = await User.findById(user._id);
        if (!findUser) {
            throw new ApiError(402, "User not created in the database");
        }
        res.status(201).json({
            success: true,
            data: {
                id: findUser._id,
                username: findUser.username,
                email: findUser.email
            },
            message: "User Created Successfully"
        })
    } catch (error) {
        throw new ApiError(500, `UserRegister controller not working and error is ${error}`)
    }
}

const loginUser = async function (req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!email && !password) {
        throw new ApiError(402, "Email & Password are mandatory");
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (!existingUser) {
            throw new ApiError(400, "User not found in login");
        }
        const verifyPassword = await existingUser.isPasswordValid(password);
        if (!verifyPassword) {
            throw new ApiError(400, "Password is not matching");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id);
        const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
            user: loggedInUser, accessToken, refreshToken,
            message: "User logged In Successfully"
        })
    } catch (error) {
        throw new ApiError(404, `User can't login and error is ${error}`)
    }
}

const logoutUser = async function (req: Request, res: Response) {
    try {
        //@ts-ignore
        await User.findByIdAndUpdate(req.user._id, {
            $unset: {
                refreshToken: 1
            }
        }, {
            new: true
        })

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
            message: "User logout Successfully"
        })
    } catch (error) {
        throw new ApiError(500, `Error in logout user and error is ${error}`);
    }
}

const resetPassword = async function (req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword && !newPassword) {
        throw new ApiError(300, "Both passwords are mandatory");
    }
    try {
                //@ts-ignore
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(401, "user not found in resetting password");
        }
        const validatePassword = await user?.isPasswordValid(oldPassword);
        if (!validatePassword) {
            throw new ApiError(303, "Your password is not valid ");
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            message: "Password changes successfully"
        })
    } catch (error) {
        throw new ApiError(401, `Error in reseting password and error is : ${error}`)
    }
}

const refreshAccessToken = async function (req: Request, res: Response) {
    const presentToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!presentToken) {
        throw new ApiError(401, "Token is not available");
    }
    try {
        const validateToken = await jwt.verify(presentToken, process.env.REFRESH_TOKEN_SECRET as string);
        if (!validateToken) {
            throw new ApiError(404, "Token is not verified")
        }
        //@ts-ignore
        const user = User.findById(validateToken?._id);
        if (!user) {
            throw new ApiError(402, "User not found in refreshToken");
        }
        //@ts-ignore
        if (presentToken !== user?.refreshToken) {
            throw new ApiError(403, "Token is expired or used or not valid")
        }
        //@ts-ignore
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)
        const options = {
            httpOnly: true,
            secure: true
        }
        res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
            user: user, accessToken, refreshToken,
            message: "successfully got refresh & accessToken"
        })
    } catch (error) {
        throw new ApiError(405, `can't get tokens due to error : ${error}`)
    }
}

const getCurrentUser = function(req:Request, res:Response){
    return res.status(200).json({
        message : "CurrentUser found successfully",
                //@ts-ignore
        user : req.user
    })
}

export {
    signupUser,
    loginUser,
    logoutUser,
    resetPassword,
    refreshAccessToken,
    getCurrentUser
}