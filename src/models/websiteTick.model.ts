import mongoose, { Schema } from "mongoose";

const websiteTickSchema = new Schema(
    {
        websiteId : {
            type : Schema.Types.ObjectId,
            ref : "Website",
            required : true,
            index : true
        },
        status : {
            type : String,
            enum : ["up", "down"],
            default : "up",
            required : true
        },
        respondTime : {
            type : Number,
            default : null
        },
        checkedAt : {
            type : Date,
            default : Date.now,
            index : true
        }
    },{ timestamps : true }
)

export const WebsiteTick = mongoose.model("WebsiteTick", websiteTickSchema);