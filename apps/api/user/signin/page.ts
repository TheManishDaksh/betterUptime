import express from "express";
import { prisma } from "store";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signinRouter = express.Router();
signinRouter.use(cookieParser());

signinRouter.post('/', async(req,res)=>{
  
  try{
    const { email, password} = req.body;
    if(!email && !password) return res.status(401).json({message : "Email and Password are required"});
    
    const user = await prisma.user.findUnique({
        where : {
            email
        }
    })
    if(!user){
       return res.status(401).json({message : "can't find the user"});
    }

    const validatePassword = await bcrypt.compare(password, user.password );
    if(!validatePassword){
      return res.status(401).json({message : "password is not verified"});
    }
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
      return res.status(401).json({message : "JWT_Secret not configured"})
    }
    const token = jwt.sign({id:user.id}, jwtSecret);
    
    res.cookie("token", token, {
      httpOnly : true,
      sameSite : "lax",
      maxAge : 60*60*24
    });

    return res.status(200).json({
      message : "user loggedIn successfully!",
      user :{
        id : user.id,
        email : user.email,
        name : user.name
      }
    })
  }catch(error){
    console.log("signin Error" + error);
     return res.status(500).send({
        message : "can't find the user"
    })
  }
})

export default signinRouter;