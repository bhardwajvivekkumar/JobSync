import express from "express";
import { ExportController } from "../controllers/exportController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();
const ctrl = new ExportController();

router.get("/csv", protect, asyncHandler(ctrl.csv));
router.get("/pdf", protect, asyncHandler(ctrl.pdf));

export default router;
