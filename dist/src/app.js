import express from "express";
import userRoutes from "./routes/user.routes.js";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhook.routes.js";
import cors from "cors";
dotenv.config();
const app = express();
// cors setup
app.use(cors({
    origin: "https://job-find-ai.vercel.app", // Explicitly allow your frontend
    credentials: true, // Allow the browser to send the Authorization header/cookies
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure Authorization is allowed
}));
// Clerk - Verify JWT token
app.use(clerkMiddleware());
// Webhooks
app.use("/api/webhooks", webhookRoutes);
// Parse body
app.use(express.json());
// API routes
app.use("/health", (req, res) => {
    res.status(200).send("OK");
});
app.use("/api/v1/users", userRoutes);
export default app;
//# sourceMappingURL=app.js.map