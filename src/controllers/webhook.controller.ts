import { verifyWebhook } from "@clerk/express/webhooks";
import type { Request, Response, NextFunction } from "express";
import type { User } from "../types/user.js";
import * as profileService from "../services/profile.service.js";
import HttpError from "../class/error.js";
import { sendSuccess } from "../utils/response.js";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const evt = await verifyWebhook(req);
    const user = evt.data as unknown as User;
    const eventType = evt.type;

    if (eventType === "user.created") {
      await profileService.createUserFromWebhook({
        clerkId: user.id,
        email: user.email_addresses?.at(0)?.email_address ?? "",
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        userName: user.username ?? user.id.replace("_", "").slice(0, 10),
        imageUrl: user.image_url ?? "",
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      });

      sendSuccess(res, "User created", undefined, 201);
    } else if (eventType === "user.deleted") {
      await profileService.deleteUserByClerkId(user.id);
      sendSuccess(res, "User deleted");
    } else {
      throw new HttpError("Unrecognized event type", 400);
    }
  } catch (error) {
    next(error);
  }
}
