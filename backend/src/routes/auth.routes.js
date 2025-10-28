import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} from "../controllers/authController/index.js";
import {
  authenticate,
  registerValidation,
  loginValidation,
  validate,
  authRateLimiter,
} from "../middleware/index.js";

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
