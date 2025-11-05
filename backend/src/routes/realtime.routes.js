import express from "express";
import { authenticate } from "../middleware/auth/index.js";
import { pusherAuth } from "../controllers/realtimeController/index.js";

const router = express.Router();

// Pusher private/presence channel auth
router.post("/pusher/auth", authenticate, pusherAuth);

export default router;
