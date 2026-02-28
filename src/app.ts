import express from "express";
import type { Express } from "express";
import userRoutes from "./routes/user.routes";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhook.routes";

dotenv.config();

const app: Express = express();

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
