import { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Our known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Unknown errors
  console.error("Unhandled Error:", err);
  return res.status(500).json({ message: "Server error" });
}
