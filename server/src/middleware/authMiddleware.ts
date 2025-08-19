import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { UnauthorizedError } from "../utils/error";

export async function protect(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) throw new UnauthorizedError();

  const secret = process.env.JWT_SECRET!;
  const decoded = jwt.verify(token, secret) as { id: string };

  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new UnauthorizedError("Invalid token");

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  next();
}
