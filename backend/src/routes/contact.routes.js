import express from "express";
import {
  requestContact,
  acceptContact,
  listContacts,
  removeContact,
  blockContact,
  unblockContact,
} from "../controllers/contactController/index.js";
import {
  authenticate,
  mongoIdValidation,
  validate,
} from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List contacts (accepted by default)
router.get("/", listContacts);

// Request by userId
router.post(
  "/request/:userId",
  mongoIdValidation("userId"),
  validate,
  requestContact
);

// Request by email in body { email }
router.post("/request", requestContact);

// Accept incoming request from userId
router.post(
  "/accept/:userId",
  mongoIdValidation("userId"),
  validate,
  acceptContact
);

// Remove contact with userId
router.delete("/:userId", mongoIdValidation("userId"), validate, removeContact);

// Block contact with userId
router.post(
  "/block/:userId",
  mongoIdValidation("userId"),
  validate,
  blockContact
);

// Unblock contact with userId
router.post(
  "/unblock/:userId",
  mongoIdValidation("userId"),
  validate,
  unblockContact
);

export default router;
