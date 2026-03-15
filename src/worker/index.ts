import axios from "axios";
import { xAckBulk, xReadGroup } from "../redis-streams";
import { WebsiteTick } from "../models/websiteTick.model";

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
    console.log(websiteStatus);
    await xAckBulk(consumerGroup, res.map(({id})=>id))
    }
}

async function fetchWebsite(id:string, url:string) {
    const startTime = Date.now();

    axios.get(url)
    .then(async()=>{
        const endTime = Date.now();
        await WebsiteTick.create({
            status : "up",
            respondTime : endTime-startTime
        })
    }).catch(async()=>{
        const endTime = Date.now();
        await WebsiteTick.create({
            status : "down",
            respondTime : endTime-startTime
        })
    })
}

main();