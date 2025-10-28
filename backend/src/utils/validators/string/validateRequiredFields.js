/**
 * Validate Required Fields
 * Validates required fields in data object
 */

import { isEmpty } from "./isEmpty.js";

/**
 * Validate required fields
 * @param {Object} data - Data object
 * @param {Array<String>} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and missing fields
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter((field) => isEmpty(data[field]));

  return {
    isValid: missing.length === 0,
    missing,
    errors: missing.map((field) => `${field} is required`),
  };
};
