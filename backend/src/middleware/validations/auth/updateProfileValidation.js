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
  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
];
