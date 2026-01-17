import type{ NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.ts";
import { User } from "../models/user.model.ts";


export const verifyJwtMiddleware = async function(req:Request, res:Response, next: NextFunction){

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    if(!token){
        throw new ApiError(401, "token not found or empty");
    }

    try{
        const verifyToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    if(!verifyToken){
        throw new ApiError(400, "token is not valid");
    }
    //@ts-ignore    
    const user = await User.findById(verifyToken._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found in jwt middleware");
    }
    //@ts-ignore
    req.user = user;
    next();
    }catch(error){
        throw new ApiError(402, `Error in JwtMiddleware ${error}`);
    }
}