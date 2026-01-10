import dotenv from 'dotenv'
import connectDB from './db/index.ts'
import { app } from './app.ts'
import { ApiError } from './utils/ApiError.ts'
dotenv.config({path : "../.env"})

connectDB().then(()=>{
    app.listen(process.env.PORT || 3000 , ()=>{
        console.log(`your app is listening on PORT : ${process.env.PORT}`);
    })
}).catch((error)=>{
    throw new ApiError(500, `your server is not running ans error is ${error}`);
})
