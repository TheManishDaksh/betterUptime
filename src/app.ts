import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, resetPassword, signupUser } from "./controllers/user.controller.ts";
import { authMiddleware } from "./middleware/index.ts";
import { addWebsite, deleteWebsite, websiteStatus } from "./controllers/website.controller.ts";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// user routes
app.post("/api/v1/signup", signupUser);
app.post("/api/v1/login", loginUser);
app.post("/api/v1/logout", authMiddleware, logoutUser);
app.post("/api/v1/reset-password", authMiddleware, resetPassword);
app.get("/api/v1/refresh-token", refreshAccessToken);
app.get("/api/v1/me", authMiddleware, getCurrentUser);

// website routes
app.post("/api/v1/create-website", authMiddleware, addWebsite);
app.delete("/api/v1/delete-website", authMiddleware, deleteWebsite);
app.get("/api/v1/status/:websiteId", authMiddleware, websiteStatus);

export { app }