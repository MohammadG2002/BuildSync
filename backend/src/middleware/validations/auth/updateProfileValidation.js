/**
 * Update Profile Validation
 */

import { body } from "express-validator";

export const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  // Allow clearing avatar by sending null or empty string; validate URL otherwise
  body("avatar")
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === "") return true; // allow removal
      if (typeof val !== "string") return false;
      // Basic URL check (avoid failing on already stored absolute URLs)
      return /^https?:\/\//i.test(val);
    })
    .withMessage("Avatar must be a valid URL"),
  body("bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("phone")
    .optional()
    .isString()
    .isLength({ max: 30 })
    .withMessage("Phone cannot exceed 30 characters"),
];
