import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {
    url : string, 
    id : string
}

type MessageType = {
    id : string,
    message : {
        url : string,
        id : string
    }
}
const streamName = "Betteruptime:websites";

async function xAdd({url, id}:WebsiteEvent){
    await client.xAdd(
        streamName , "*" , {
            url,
            id
        }
    )
}

async function  xAddBulk(websites:WebsiteEvent[]){
    for( let i = 0; i < websites.length; i++){
        await xAdd({
            url : websites[i]?.url as string,
            id : websites[i]?.id as string
        })
    }
}

async function xReadGroup(consumerGroup:string, worker:string){
    const response = await client.xReadGroup(
        consumerGroup, worker, {
            key : streamName,
            id : ">"
        }, {
            COUNT : 5
        }
    )
    //@ts-ignore
    let messages: MessageType[] | undefined = response?.[0].messages;

    return messages;  
}

async function xAck(consumerGroup:string, itemId:string){
    await client.xAck(streamName, consumerGroup, itemId);
}

async function xAckBulk(consumerGroup:string, itemIds:string[]){
    itemIds.map(itemId=>xAck(consumerGroup, itemId))
}

export {
    xAddBulk,
    xReadGroup,
    xAckBulk
}