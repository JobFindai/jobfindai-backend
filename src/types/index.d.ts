import type { UserModel } from "../../generated/prisma/models.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}

export {};
