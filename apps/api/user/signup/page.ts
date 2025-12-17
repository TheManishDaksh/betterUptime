import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "store/client";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv"

const signUpRouter = express.Router();
dotenv.config();

signUpRouter.post("/", async(req, res)=>{
    const { name, password, email } = req.body;

    try{
        const user = await prisma.user.findFirst({
            where : email
        })
        if(user){
            res.status(409).json({message : "user already exist"});
        }
    }catch{
        try{
            const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.user.create({
            data : {
                name,
                email,
                hashedPassword
            }
        });
        if(!user){
        res.status(401).json({message : "can't create the user"});
        }
        const jwtSecret = process.env.JWT_SECRET;
        const token = Jwt.sign( {id : user.id}, jwtSecret || "msnisfhMNAID73949");
        res.json({
            token
        })
        }catch{
            res.status(500).json({message : "can't signup this guy"});
        }
    }
})

export default signUpRouter;