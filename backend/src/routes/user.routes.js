import express from "express";
import { getUserPublic } from "../controllers/userController/getUserPublic.js";

const router = express.Router();

// Public: fetch user profile by id
router.get("/:id", getUserPublic);

export default router;
