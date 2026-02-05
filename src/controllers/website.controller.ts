import type { Request, Response } from "express"
import { Website } from "../models/website.model"
import { ApiError } from "../utils/ApiError"

const addWebsite = async(req : Request, res : Response)=>{
    if(!req.body.url){
        throw new ApiError( 400, "Website url is necessary" );
    }

    const websites = await Website.create({
        url : req.body.url,
        timeAdded : new Date(),
        userId : req.body.userId
    })

    res.json({
       id : websites._id
    })
}