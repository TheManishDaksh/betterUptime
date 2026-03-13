import { Website } from "../models/website.model";
import { xAddBulk } from "../redis-streams";

async function main(){
    const websites = await Website.find().select("url _id").lean();
    
    await xAddBulk(websites.map(w=>({
        url : w.url,
        id : w._id.toString()
    })))
}

setInterval(() => {
    main();
}, 1*1000*60*60);

main();