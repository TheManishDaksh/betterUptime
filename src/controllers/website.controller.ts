import type { Request, Response } from "express"
import { Website } from "../models/website.model"
import { ApiError } from "../utils/ApiError"
import { WebsiteTick } from "../models/websiteTick.model";

const addWebsite = async(req : Request, res : Response)=>{
    if(!req.body.url){
        throw new ApiError( 400, "Website url is necessary" );
    }

    const website = await Website.create({
        url : req.body.url,
        timeAdded : new Date(),
        userId : req.body.userId
    })
    if(!website){
        throw new ApiError(400, "error in adding website")
    }
    res.json({
       id : website._id
    })
}

const deleteWebsite = async(req : Request, res : Response)=>{
    try{
         await Website.findByIdAndDelete({
        _id : req.params.websiteId
    })
    }catch(error){
        throw new ApiError( 400, "could not delete website , try again")
    }
}

const websiteStatus =  async(req : Request, res : Response)=>{
    try{
        const website = await Website.findOne({
        userId : req.userId,
        websiteId : req.params.websiteId
    })

    if(!website){
        throw new ApiError( 500, "website not found, db error")
    }

    const tick = await WebsiteTick.findOne({
        _id : req.params.websiteId
    }).sort({ checkedAt : -1 });

    res.json({
        website,
        tick
    })
    }catch(error){
        throw new ApiError(404, `error is in checkStatus function and is ${error}`)
    }
}

export {
    addWebsite,
    deleteWebsite,
    websiteStatus
}