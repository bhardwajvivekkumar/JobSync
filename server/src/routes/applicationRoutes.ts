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

export default router;
