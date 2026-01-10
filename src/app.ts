import express from "express";
import { signupUser } from "./controllers/user.controller.ts";

const app = express();

app.use(express.json());

app.post("/api/v1/signup", signupUser);

export { app }