import type { Response } from "express";

type ApiResponse<T = undefined> = {
  status: "success" | "error";
  message: string;
  data?: T;
};

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
): void {
  const response: ApiResponse<T> = { status: "success", message };
  if (data !== undefined) {
    response.data = data;
  }
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
): void {
  res.status(statusCode).json({ status: "error", message } satisfies ApiResponse);
}
