import express, { json } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { prisma } from "store/client";

const app = express();
app.use(express.json());
app.use(cors())

app.get("/signup", async(req, res)=>{
    const { name, password, email } = req.body;

    try{
        const user = await prisma.user.findfirst({
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
        if(user){
            res.status(201).json({message : "user has been created"});
            res.json({userId : user.id,
                name : name
            });
        }
        }catch{
            res.status(500).json({message : "user not created"});
        }
    }


})