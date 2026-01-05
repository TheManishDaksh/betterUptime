import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            index : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },
        password : {
            type : String,
            required : [ true, "Password is required"]
        },
        websites : {
            type : Schema.Types.ObjectId,
            ref : "Website"
        }
    },{
        timestamps : true
    }
)

userSchema.pre("save", async function(next) {
    //@ts-ignore
    if(!this.isModified("password")) return next();
    //@ts-ignore
    this.password = await bcrypt.hash(this.password, 10);
    //@ts-ignore
    next();
})

export const User = mongoose.model("User", userSchema);