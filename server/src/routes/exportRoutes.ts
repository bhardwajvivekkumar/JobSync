import express from "express";
import { protect } from "../middleware/authMiddleware";
import { exportCSV, exportPDF } from "../controllers/exportController";

const router = express.Router();

router.get("/csv", protect, exportCSV);
router.get("/pdf", protect, exportPDF);

export default router;
