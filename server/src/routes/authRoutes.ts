import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  deleteUser,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { sendResetEmail } from "../utils/mailer";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protect, getMe);

router.get("/test-email", async (req, res) => {
  try {
    const testRecipient = "vk3411381@gmail.com";
    const info = await sendResetEmail(
      testRecipient,
      "Test User",
      "http://localhost:3000/reset-password/fake-token"
    );

    res.json({ success: true, info });
  } catch (error: any) {
    console.error("Error in test-email route:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.delete("/delete", protect, deleteUser);

export default router;
