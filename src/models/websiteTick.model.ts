import mongoose, { Document, Schema, Types } from "mongoose";

export interface websiteTickTypes {
    websiteId: Types.ObjectId,
    status: string,
    respondTime: Number,
    checkedAt: Number
}

export interface websiteTickDocument extends websiteTickTypes, Document { }

const websiteTickSchema = new Schema<websiteTickDocument>(
    {
        websiteId: {
            type: Schema.Types.ObjectId,
            ref: "Website",
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: ["up", "down", "unknown"],
            default: "unknown",
            required: true
        },
        respondTime: {
            type: Number,
            default: null
        },
        checkedAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    }, { timestamps: true }
)

export const WebsiteTick = mongoose.model<websiteTickDocument>("WebsiteTick", websiteTickSchema);