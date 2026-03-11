import mongoose, { Document, Schema } from "mongoose";

export interface websiteTypes {
    url : string,
    userId : Schema.Types.ObjectId,
    timeAdded : Number,
    status : string,
    lastStatusChange : Number
}

export interface websiteDocument extends websiteTypes, Document{}

const websiteSchema = new Schema<websiteDocument>(
    {
        url : {
            type : String,
            required :true,
            trim : true
        },
        userId : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        timeAdded : {
            type : Date,
            default : Date.now()
        },
        status : {
            type :String,
            enum : ["up", "down"],
            default : "up",
            index : true
        },
        lastStatusChange : {
            type : Date,
            default : Date.now()
        }
    },{
        timestamps : true
    }
)

export const Website = mongoose.model<websiteDocument>("Website", websiteSchema);