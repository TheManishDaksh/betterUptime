import type { Request, Response } from "express"
import { Website } from "../models/website.model.ts"
import { ApiError } from "../utils/ApiError.ts"
import { WebsiteTick } from "../models/websiteTick.model.ts";

const addWebsite = async (req: Request, res: Response) => {
    if (!req.body.url) {
        throw new ApiError(400, "Website url is necessary");
    }
    try {
        const website = await Website.create({
            url: req.body.url,
            timeAdded: new Date(),
            userId: req.userId
        })
        if (!website) {
            throw new ApiError(400, "error in adding website")
        }
        res.json({
            id: website._id
        })
    } catch (error) {
        throw new ApiError(500, "looks like some db error in adding website" + error)
    }
}

const deleteWebsite = async (req: Request, res: Response) => {
    try {
        await Website.findByIdAndDelete({
            _id: req.params.websiteId
        })
    } catch (error) {
        throw new ApiError(400, "could not delete website , try again" + error)
    }
}

const getAllWebsite = async (req: Request, res: Response) => {
    try {
        const websites = await Website.find({
            userId: req.userId
        })
        res.json({
            websites
        })
    } catch (error) {
        throw new ApiError(500, "db error website not found in db" + error)
    }
}

const websiteStatus = async (req: Request, res: Response) => {
    try {
        const website = await Website.findOne({
            userId: req.userId,
            _id: req.params.websiteId
        })

        if (!website) {
            throw new ApiError(500, "website not found, db error")
        }

        const tick = await WebsiteTick.findOne({
            websiteId: req.params.websiteId
        }).sort({ checkedAt: -1 });

        res.json({
            website,
            tick
        })
    } catch (error) {
        throw new ApiError(404, `error is in checkStatus function and is ${error}`)
    }
}

export {
    addWebsite,
    deleteWebsite,
    websiteStatus,
    getAllWebsite
}