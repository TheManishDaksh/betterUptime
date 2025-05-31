import express, { json } from "express"
import { prismaClient } from "store/client"
const app = express();
app.use(express.json());

app.post("/website", async(req, res)=>{
    if(!req.body.url){
        res.status(403).json({message : "Enter the URL"})
        return ;
    }
    const website = await prismaClient.website.create({
        url : req.body.url,
        timeAdded : Date.now()
    })
    res.json({
        id : website.id
    })
})

app.get("/status/:websiteId", (req, res)=>{

})

app.listen(process.env.PORT || 3000);