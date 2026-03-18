import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.ts";


const connectDB = async function () {
    try {
        console.log("mongo in mongo connect function" + process.env.DATABASE_URL);
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/betteruptime`)
    } catch (error) {
        throw new ApiError(500, `DB error is : ${error}`);
    }
}

export default connectDB;