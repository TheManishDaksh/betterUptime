import connectDB from "../db";
import { Website } from "../models/website.model";
import { WebsiteTick } from "../models/websiteTick.model";
import { LPush, RPop } from "../redis-streams";
import { ApiError } from "../utils/ApiError";


await connectDB().then(() => {
            console.log("db is connecting on alert-worker");
        }).catch((error) => {
            throw new ApiError(500, `your server is not running on alert-worker and error is ${error}`);
        });
async function main() {
    while (true) {
        const websiteId = await RPop("alert");
        console.log("poping from redis queue in alert")        
        //@ts-ignore
        if (!websiteId) {
            await new Promise(r => setTimeout(r, 1000*5));
            continue;
        }
        await fetchLastTicks(websiteId);
    }
}

async function fetchLastTicks(websiteId: string) {
    try{
            const ticks = await WebsiteTick.find({ websiteId })
        .sort({ checkedAt: -1 })
        .limit(3);

    const allDown = ticks.length === 3 && ticks.every(t => t.status === "down");

    if(!allDown) return;

    const website = await Website
        .findById(websiteId)
        .populate("userId", "email");

    const email = (website?.userId as any)?.email;

    if (!email) return;
    
    await LPush("email", email);
    }catch(error){
        throw new ApiError(500, "something got wrong in fetchLastticks function on alert-worker" + error)
    }
}

main();