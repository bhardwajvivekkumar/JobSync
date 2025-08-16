import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req?.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
