import express from "express";
import cors from "cors";
import signinRouter from "./user/signin/page";
import signUpRouter from "./user/signup/page";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth/signin', signinRouter );
app.use('/auth/signup', signUpRouter        )

app.listen(process.env.PORT || 3000);