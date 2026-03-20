import { Resend } from "resend";
import { RPop } from "../redis-streams";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
    while (true) {
        const email = await RPop("email");
        console.log("poping from redis queue in email-worker") 
        //@ts-ignore
        if (!email) {
            await new Promise(r => setTimeout(r, 1000*5));
            continue;
        }        
        await sendMail(email);
    }
}

async function sendMail(email:any){    
    resend.emails.send({
  from: 'manishk78625@gmail.com',
  to: email,
  subject: 'Betteruptime: A monitoring website',
  html: '<p>your website is down from last 15 minutes , please keep it up.</p>'
});
}

main();