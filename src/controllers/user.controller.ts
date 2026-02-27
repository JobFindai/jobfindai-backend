import type { Request, Response } from "express";

export function updateUser(req: Request, res: Response) {
  console.log("This url is active", req.body);
  // update user
  // Primary way of signing up is by connecting Gmail - Achieve this using Oauth
  return res.status(200).json({
    success: true,
  });
}
