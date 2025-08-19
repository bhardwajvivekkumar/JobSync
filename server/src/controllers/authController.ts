import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";
import Job from "../models/JobApplication";
import { BadRequestError, UnauthorizedError } from "../utils/error";
import { sendResetEmail } from "../utils/mailer";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const sign = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const resetSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(6),
  }),
});

const forgotSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export class AuthController {
  register = async (req: Request, res: Response) => {
    registerSchema.parse({ body: req.body });

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new BadRequestError("User already exists");

    const user = await User.create({ name, email, password });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: sign(user._id.toString()),
    });
  };

  login = async (req: Request, res: Response) => {
    loginSchema.parse({ body: req.body });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: sign(user._id.toString()),
    });
  };

  me = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedError();
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  };

  forgotPassword = async (req: Request, res: Response) => {
    forgotSchema.parse({ body: req.body });

    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.json({
        message: "If the email exists, a reset link was sent.",
      });

    const raw = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `${CLIENT_URL}/reset-password?token=${raw}`;
    await sendResetEmail(user.email, user.name, resetLink);

    return res.json({ message: "If the email exists, a reset link was sent." });
  };

  resetPassword = async (req: Request, res: Response) => {
    resetSchema.parse({ body: req.body });

    const { token, password } = req.body;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) throw new BadRequestError("Invalid or expired token");

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: "Password has been reset successfully" });
  };

  deleteUser = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedError();
    const userId = req.user.id;
    await Job.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    return res.json({ message: "User and all jobs deleted successfully" });
  };
}
