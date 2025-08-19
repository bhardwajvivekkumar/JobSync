import express from "express";
import { protect } from "../middleware/authMiddleware";
import { ApplicationController } from "../controllers/applicationController";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import {
  createApplicationSchema,
  idParamSchema,
  updateApplicationSchema,
} from "../validations/application.validation";

const router = express.Router();
const ctrl = new ApplicationController();

router.get("/", protect, asyncHandler(ctrl.list));
router.post(
  "/",
  protect,
  validate(createApplicationSchema),
  asyncHandler(ctrl.create)
);
router.get("/followups/due", protect, asyncHandler(ctrl.dueFollowUps));

router.get("/dashboard/count", protect, asyncHandler(ctrl.count));
router.get("/dashboard/trends", protect, asyncHandler(ctrl.trends));
router.get("/dashboard/activity", protect, asyncHandler(ctrl.perDay));
router.get("/dashboard/status", protect, asyncHandler(ctrl.byStatus));

router.get(
  "/:id",
  protect,
  validate(idParamSchema),
  asyncHandler(ctrl.getById)
);
router.put(
  "/:id",
  protect,
  validate(updateApplicationSchema),
  asyncHandler(ctrl.update)
);
router.delete(
  "/:id",
  protect,
  validate(idParamSchema),
  asyncHandler(ctrl.delete)
);

export default router;
