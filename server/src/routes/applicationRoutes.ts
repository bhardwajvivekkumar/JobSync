import express from "express";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  getDueFollowUps,
  getApplicationsCount,
  getApplicationsOverTime,
  getApplicationsPerDay,
  getApplicationsByStatus,
  deleteApplication,
} from "../controllers/applicationController";
import JobApplication from "../models/JobApplication";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const apps = await JobApplication.find({ userId: req.user.id }); // req.user comes from protect middleware
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const application = await JobApplication.create({
      ...req.body,
      userId: req.user.id, // store logged-in user
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: "Error creating application", error });
  }
});

router.post("/", protect, createApplication);
router.get("/", protect, getAllApplications);
router.get("/followups/due", protect, getDueFollowUps);
router.get("/:id", protect, getApplicationById);
router.put("/:id", protect, updateApplication);
router.put("/:id/followup-toggle", protect, async (req, res) => {
  try {
    const app = await JobApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.followUpDone = !app.followUpDone;

    await app.save();

    res.status(200).json(app);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle follow-up status" });
  }
});
router.get("/dashboard/count", protect, getApplicationsCount);
router.get("/dashboard/trends", protect, getApplicationsOverTime);
router.get("/dashboard/activity", protect, getApplicationsPerDay);
// router.get("/dashboard/status", getApplicationsByStatus);

router.get("/dashboard/status", protect, async (req, res) => {
  try {
    const pipeline = [
      {
        $match: { userId: req.user.id }, // only get applications of this user
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const statusCounts = await JobApplication.aggregate(pipeline);

    const result: { [key: string]: number } = {};
    statusCounts.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (err) {
    console.error("Error in status dashboard:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", protect, deleteApplication);

export default router;
