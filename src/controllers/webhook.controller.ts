import { verifyWebhook } from "@clerk/express/webhooks";
import type { NextFunction, Request, Response } from "express";
import { Webhook } from "svix";
import HttpError from "../class/error.js";
import type { User } from "../types/user.js";
import { prisma } from "../utils/prisma.js";

export async function validateWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    const payloadString = ((await req.body) as Object).toString();

    const svixHeaders = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    const wh = new Webhook(webhookSecret as string);

    const payload = wh.verify(payloadString, svixHeaders);
    // console.log(payload);

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Invalid Signature" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    // Verify WebHook Event Type
    const evt = await verifyWebhook(req);

    const user = evt.data as unknown as User;
    const eventType = evt.type;

    if (eventType === "user.created") {
      // Create new user in db to sync with clerk

      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.email_addresses?.at(0)?.email_address ?? "",
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
          onboardingStatus: "PENDING",
          userName: user.username ?? user.id.replace("_", "").slice(0, 10),
          updatedAt: new Date(user.updated_at),
          createdAt: new Date(user.created_at),
          imageUrl: user.image_url ?? "",
        },
      });

      return res.status(201).json({ message: "User created" });
    } else if (eventType === "user.deleted") {
      // Delete User record from db
      await prisma.user.delete({
        where: {
          clerkId: user.id,
        },
      });
    } else {
      throw new HttpError("Unrecognized Event Type", 400);
    }
  } catch (err: unknown) {
    const error = err as HttpError & Error;
    console.log(error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
}
