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
    await connectDB().then(()=>{
        console.log("db is also connecting on pusher");
    }).catch((error)=>{
        throw new ApiError(500, `your server is not running on pusher and error is ${error}`);
    })
    const startTime = Date.now();

    axios.get(url)
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