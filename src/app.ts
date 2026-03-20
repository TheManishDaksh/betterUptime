import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, resetPassword, signupUser } from "./controllers/user.controller.ts";
import { authMiddleware } from "./middleware/index.ts";
import { addWebsite, deleteWebsite, getAllWebsite, websiteStatus } from "./controllers/website.controller.ts";

const app = express();
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	limit: 50, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56,
    message: "too much request you want to spoil my well written api",
    statusCode: 429,
})

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(limiter);

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
app.get("/api/v1/getAll", authMiddleware, getAllWebsite);

export { app }