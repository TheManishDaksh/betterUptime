import mongoose, { Schema } from "mongoose";

const websiteSchema = new Schema(
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
            time : Date,
            default : Date.now()
        },
        status : {
            type :String,
            enum : ["up", "down"],
            default : "up",
            index : true
        },
        lastStatusChange : {
            time : Date,
            default : Date.now()
        }
    },{
        timestamps : true
    }
)

export const Website = mongoose.model("Website", websiteSchema);