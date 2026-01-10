import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.ts";

console.log(process.env.DATABASE_URL);

const connectDB = async function(){
    try{
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/betteruptime`)
    }catch(error){
        throw new ApiError(500, `DB error is : ${error}`);
    }
}

export default connectDB;