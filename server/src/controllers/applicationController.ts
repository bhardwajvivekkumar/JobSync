import { Request, Response } from "express";
import JobApplication from "../models/JobApplication";

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
