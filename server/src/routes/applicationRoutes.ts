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
} from "../controllers/applicationController";
import JobApplication from "../models/JobApplication";

const router = express.Router();

router.post("/", createApplication);
router.get("/", getAllApplications);
router.get("/followups/due", getDueFollowUps);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.put("/:id/followup-toggle", async (req, res) => {
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
router.get("/dashboard/count", getApplicationsCount);
router.get("/dashboard/trends", getApplicationsOverTime);
router.get("/dashboard/activity", getApplicationsPerDay);
// router.get("/dashboard/status", getApplicationsByStatus);

router.get("/dashboard/status", async (req, res) => {
  try {
    const pipeline = [
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

export default router;
