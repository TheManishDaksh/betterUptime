import connectDB from "../db";
import { Website } from "../models/website.model";
import { xAddBulk } from "../redis-streams";
import { ApiError } from "../utils/ApiError";

async function main(){
    try{
        await connectDB().then(()=>{
        console.log("db is also connecting on pusher");
    }).catch((error)=>{
        throw new ApiError(500, `your server is not running on pusher and error is ${error}`);
    })
    
    const websites = await Website.find().select("url _id").lean();
    
    await xAddBulk(websites.map(w=>({
        url : w.url,
        id : w._id.toString()
    })))
    }catch(error){
        throw new ApiError(500, "seems like having issue in db connection or in try catch in pusher");
    }
}

setInterval(() => {
    main();
}, 1*1000*60*60);

main();