import dotenv from 'dotenv'
dotenv.config({path : "../.env"})
console.log("Hello via Bun! Entry point of application");

console.log(process.env.ACCESS_TOKEN_SECRET)