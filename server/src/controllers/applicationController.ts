import { Request, Response } from "express";
import JobApplication from "../models/JobApplication";
import { PipelineStage } from "mongoose";

// Ensure Request has user
interface AuthRequest extends Request {
  user?: { id: string };
}

// CREATE application for logged-in user
export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const job = await JobApplication.create({
      ...req.body,
      userId: req.user.id, // bind application to the logged-in user
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error creating application", error: err });
  }
};

// GET all applications for logged-in user
export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const jobs = await JobApplication.find({ userId: req.user.id });
    res.status(200).json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err });
  }
};

// GET one application (only if owned by the user)
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: "Error fetching application", error: err });
  }
};

// UPDATE application (only if owned by the user)
export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.appliedAt)
      updateData.appliedAt = new Date(updateData.appliedAt);
    if (updateData.followUpReminder)
      updateData.followUpReminder = new Date(updateData.followUpReminder);

    const updated = await JobApplication.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating application", error: err });
  }
};

// GET due follow-ups for the logged-in user
export const getDueFollowUps = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const today = new Date().toISOString().split("T")[0];
    const dueFollowUps = await JobApplication.find({
      userId: req.user.id,
      followUpReminder: { $lte: new Date(today + "T23:59:59Z") },
      followUpDone: false,
    });

    res.status(200).json(dueFollowUps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching follow-ups", error: err });
  }
};

// GET application count for logged-in user
export const getApplicationsCount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const count = await JobApplication.countDocuments({ userId: req.user.id });
    console.log("User from token:", req.user);
    const apps = await JobApplication.find({ user: req.user.id });
    console.log("Found applications:", apps);
    res.status(200).json({ count });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error counting applications", error: err });
  }
};

// GET monthly application trends for logged-in user
export const getApplicationsOverTime = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: req.user.id,
          appliedAt: { $type: "date" },
        },
      },
      {
        $group: {
          _id: { $month: "$appliedAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const results = await JobApplication.aggregate(pipeline);
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
    const formatted = months.map((month, index) => {
      const found = results.find((r) => r._id === index + 1);
      return { month, count: found?.count || 0 };
    });

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trends", error: err });
  }
};

// GET heatmap per day for logged-in user
export const getApplicationsPerDay = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const data = await JobApplication.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted: Record<string, number> = {};
    data.forEach((item) => {
      formatted[item._id] = item.count;
    });

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching heatmap", error: err });
  }
};

// GET applications by status for logged-in user
export const getApplicationsByStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const results = await JobApplication.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = results.map((r) => ({
      status: r._id || "Unknown",
      count: r.count,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching status data", error: err });
  }
};
