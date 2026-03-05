import express from "express";
import type { Express } from "express";
import userRoutes from "./routes/user.routes.js";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhook.routes.js";
import cors from "cors";

dotenv.config();

const app: Express = express();

//Development cors setup
// app.use(
//   cors({
//     origin: ["http://localhost:3001"],
//     credentials: true,
//   }),
// );

// Production Cors Setup
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://job-find-ai.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Clerk - Verify JWT token
app.use(clerkMiddleware());

// Webhooks
app.use("/api/webhooks", webhookRoutes);

// Parse body
app.use(express.json());

// API routes
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});
app.use("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/v1/users", userRoutes);

export default app;
