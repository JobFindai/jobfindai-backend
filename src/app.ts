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
app.use(
  cors({
    origin: ["https://job-find-ai.vercel.app"],
    credentials: true,
  }),
);

app.options("*", cors());

// Clerk - Verify JWT token
app.use(clerkMiddleware());

// Webhooks
app.use("/api/webhooks", webhookRoutes);

// Parse body
app.use(express.json());

// API routes
app.use("/", (req, res) => {
  res.status(200).send("Server is Up and Running ✅");
});
app.use("/api/v1/users", userRoutes);

export default app;
