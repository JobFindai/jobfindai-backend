import express from "express";
import type { Express } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app: Express = express();

// CORS
app.use(
  cors({
    origin: ["https://job-find-ai.vercel.app", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Clerk JWT verification
app.use(clerkMiddleware());

// Webhooks (before json parser — needs raw body)
app.use("/api/webhooks", webhookRoutes);

// Parse JSON body
app.use(express.json());

// Health checks
app.get("/", (_req, res) => {
  res.send("Backend Running");
});
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

// API routes
app.use("/api/v1/profile", profileRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
