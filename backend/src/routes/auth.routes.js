import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import {
  registerValidation,
  loginValidation,
  validate,
} from "../middleware/validation.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", authRateLimiter, loginValidation, validate, login);

// Protected routes
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.post("/logout", authenticate, logout);

export default router;
