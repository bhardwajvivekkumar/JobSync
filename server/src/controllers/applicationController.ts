import { Request, Response } from "express";
import { ApplicationService } from "../services/application.service";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/error";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export class ApplicationController {
  private service = new ApplicationService();

  private requireUser(req: Request) {
    if (!req.user?.id) throw new UnauthorizedError();
    return req.user.id;
  }

  create = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const job = await this.service.create(userId, req.body);
    return res.status(201).json(job);
  };

  list = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const jobs = await this.service.list(userId);
    return res.status(200).json(jobs);
  };

  getById = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const app = await this.service.getById(userId, req.params.id);
    if (!app) throw new NotFoundError("Application not found");
    return res.status(200).json(app);
  };

  update = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const updated = await this.service.update(userId, req.params.id, req.body);
    if (!updated) throw new NotFoundError("Application not found");
    return res.status(200).json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const deleted = await this.service.delete(userId, req.params.id);
    if (!deleted) throw new NotFoundError("Application not found");
    return res
      .status(200)
      .json({
        message: "Application deleted successfully",
        deletedId: req.params.id,
      });
  };

  dueFollowUps = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const today = new Date().toISOString().split("T")[0];
    const until = new Date(`${today}T23:59:59Z`);
    const data = await this.service.dueFollowUps(userId, until);
    return res.status(200).json(data);
  };

  count = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const count = await this.service.count(userId);
    return res.status(200).json({ count });
  };

  trends = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const results = await this.service.trendsByMonth(userId);
    const formatted = months.map((m, idx) => {
      const found = results.find((r) => r._id === idx + 1);
      return { month: m, count: found?.count || 0 };
    });
    return res.status(200).json(formatted);
  };

  perDay = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const data = await this.service.perDay(userId);
    const formatted: Record<string, number> = {};
    data.forEach((d) => {
      formatted[d._id] = d.count;
    });
    return res.status(200).json(formatted);
  };

  byStatus = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const results = await this.service.byStatus(userId);
    const formatted = results.map((r) => ({
      status: r._id || "Unknown",
      count: r.count,
    }));
    return res.status(200).json(formatted);
  };
}
