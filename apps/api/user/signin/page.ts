import express from "express";
import cors from "cors";
import { prisma } from "store/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signinRouter = express.Router();

signinRouter.post('/', async(req,res)=>{
  const { email, password} = req.body;
  
  try{
    const user = await prisma.user.findFirst({
        where : {
            email
        }
    })
    if(!user){
       res.status(403).send({message : "can't find the user"});
    }

    const validatePassword = await bcrypt.compare(password, user.password );
    if(!validatePassword){
       res.status(402).json({message : "password is not verified"});
    }
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({id:user.id}, jwtSecret || "manihMANSIHJDC84926");
    
    res.status(201).send({
        user : user,
        token,
        message : "user found! "
    })
  }catch(error){
    console.log("signin Error" + error);
     res.status(403).send({
        message : "can't find the user"
    })
  }
})

export default signinRouter;