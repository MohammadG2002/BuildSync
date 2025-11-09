import { body, param } from "express-validator";

export const updateTagValidation = [
  param("id").isMongoId().withMessage("Invalid tag id"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Tag name must be between 1 and 50 characters"),
  body("color")
    .optional()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage("Color must be a valid hex code"),
  body("backgroundColor")
    .optional()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage("Background color must be a valid hex code"),
];
