import type { Request, Response, NextFunction } from "express";
import HttpError from "../class/error.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Known HTTP errors
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Prisma known errors
  if (isPrismaError(err)) {
    const { statusCode, message } = handlePrismaError(err);
    res.status(statusCode).json({ status: "error", message });
    return;
  }

  // Generic errors
  const message =
    err instanceof Error ? err.message : "Internal server error";
  console.error("Unhandled error:", err);
  res.status(500).json({ status: "error", message });
}

function isPrismaError(err: unknown): err is { code: string; meta?: Record<string, unknown> } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string"
  );
}

function handlePrismaError(err: { code: string; meta?: Record<string, unknown> }): {
  statusCode: number;
  message: string;
} {
  switch (err.code) {
    case "P2002":
      return { statusCode: 409, message: "A record with this value already exists" };
    case "P2025":
      return { statusCode: 404, message: "Record not found" };
    default:
      return { statusCode: 500, message: "Database error" };
  }
}
