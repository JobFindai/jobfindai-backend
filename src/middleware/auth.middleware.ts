import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma.js";
import { sendError } from "../utils/response.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      sendError(res, "Authentication required", 401);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    sendError(res, "Authentication failed", 401);
  }
}
