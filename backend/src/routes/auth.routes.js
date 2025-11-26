import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  sendVerificationCode,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController/index.js";
import {
  authenticate,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  validate,
  authRateLimiter,
} from "../middleware/index.js";

const router = express.Router();

// Public routes
router.post("/send-verification-code", authRateLimiter, sendVerificationCode);
router.post("/verify-email", authRateLimiter, verifyEmail);
router.post("/register", registerValidation, validate, register);
router.post("/login", authRateLimiter, loginValidation, validate, login);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPassword);

// Protected routes
router.get("/me", authenticate, getMe);
router.put(
  "/profile",
  authenticate,
  updateProfileValidation,
  validate,
  updateProfile
);
router.put("/change-password", authenticate, changePassword);
router.post("/logout", authenticate, logout);

export default router;
