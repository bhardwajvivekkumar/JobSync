import express from "express";
import { AuthController } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();
const ctrl = new AuthController();

router.post("/register", asyncHandler(ctrl.register));
router.post("/login", asyncHandler(ctrl.login));
router.post("/forgot-password", asyncHandler(ctrl.forgotPassword));
router.post("/reset-password", asyncHandler(ctrl.resetPassword));
router.get("/me", protect, asyncHandler(ctrl.me));
router.delete("/delete", protect, asyncHandler(ctrl.deleteUser));

export default router;
