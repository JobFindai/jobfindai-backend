import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response.js";
import HttpError from "../class/error.js";
import { getFullProfile } from "../services/profile.service.js";
import { getDashboard } from "../services/dashboard.service.js";

export async function dashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    const userWithProfile = await getFullProfile(req.user.clerkId);
    const profile = userWithProfile?.profile ?? null;

    const data = await getDashboard(req.user, profile);
    sendSuccess(res, "Dashboard retrieved successfully", data);
  } catch (error) {
    next(error);
  }
}
