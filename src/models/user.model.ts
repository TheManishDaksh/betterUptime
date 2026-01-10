import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config({path : "../../.env"})

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

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(password:any) {
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        id : this._id,
        username : this.username,
        email : this.email,
        password : this.password
    },  //@ts-ignore
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        id : this._id
    },  //@ts-ignore
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
)
}
export const User = mongoose.model("User", userSchema);