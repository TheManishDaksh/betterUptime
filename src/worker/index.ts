import axios from "axios";
import { xAckBulk, xReadGroup } from "../redis-streams";
import { WebsiteTick } from "../models/websiteTick.model";
import {Types} from "mongoose";
import connectDB from "../db";
import { ApiError } from "../utils/ApiError";

const consumerGroup = "Indian-group";
async function main(){
    while(1){
        const res = await xReadGroup(consumerGroup, "Ind-1");
    if(!res){
        console.log("nothing to read ");
        return;
    }
    
    const websiteStatus = res.map(({message})=> fetchWebsite(message.id, message.url));
    await Promise.all(websiteStatus);
    await xAckBulk(consumerGroup, res.map(({id})=>id))
    }
}

async function fetchWebsite(id:string, url:string) {
    
    // in this function there is printing the logs of pusher connecDB logs and db files logs also finout why
    
    await connectDB().then(()=>{
        console.log("db is also connecting on worker");
    }).catch((error)=>{
        throw new ApiError(500, `your server is not running on worker and error is ${error}`);
    })  
    const startTime = Date.now();

    await axios.get(url)
    .then(async()=>{
        const endTime = Date.now();
        await WebsiteTick.create({
            websiteId : new Types.ObjectId(id),
            status : "up",
            respondTime : endTime-startTime
        })
    }).catch(async()=>{
        const endTime = Date.now();
        await WebsiteTick.create({
            websiteId : new Types.ObjectId(id),
            status : "down",
            respondTime : endTime-startTime
        })
    })
}

main();