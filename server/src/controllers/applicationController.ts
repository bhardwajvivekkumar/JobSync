import { Request, Response } from "express";
import JobApplication from "../models/JobApplication";
import { PipelineStage } from "mongoose";

export const createApplication = async (req: Request, res: Response) => {
  try {
    const job = await JobApplication.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error creating application", error: err });
  }
};

export const getAllApplications = async (_: Request, res: Response) => {
  try {
    const jobs = await JobApplication.find();
    res.status(200).json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: "Error fetching application", error: err });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Convert incoming date strings to Date objects if necessary
    const updateData = { ...req.body };
    if (updateData.appliedAt)
      updateData.appliedAt = new Date(updateData.appliedAt);
    if (updateData.followUpReminder)
      updateData.followUpReminder = new Date(updateData.followUpReminder);

    const updated = await JobApplication.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating application", error: err });
  }
};

export const getDueFollowUps = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const dueFollowUps = await JobApplication.find({
      followUpReminder: { $lte: new Date(today + "T23:59:59Z") },
      followUpDone: false,
    });
    res.status(200).json(dueFollowUps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching follow-up reminders", error: err });
  }
};

export const getApplicationsCount = async (_: Request, res: Response) => {
  try {
    const count = await JobApplication.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error counting applications", error: err });
  }
};

export const getApplicationsOverTime = async (_: Request, res: Response) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          appliedAt: { $type: "date" },
        },
      },
      {
        $group: {
          _id: { $month: "$appliedAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
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
    res.status(500).json({
      message: "Error fetching application trends",
      error: (err as Error).message,
    });
  }
};

export const getApplicationsPerDay = async (_: Request, res: Response) => {
  try {
    const data = await JobApplication.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format to { "2025-07-01": 3, "2025-07-02": 1, ... }
    const formatted: Record<string, number> = {};
    data.forEach((item) => {
      formatted[item._id] = item.count;
    });

    res.status(200).json(formatted);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching heatmap data", error: err });
  }
};

export const getApplicationsByStatus = async (_: Request, res: Response) => {
  try {
    const results = await JobApplication.aggregate([
      {
        $group: {
          _id: "$status", // Assuming each application has a `status` field
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
    res.status(500).json({
      message: "Error fetching applications by status",
      error: (err as Error).message,
    });
  }
};
