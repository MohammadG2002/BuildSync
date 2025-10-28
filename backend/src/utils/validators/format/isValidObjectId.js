/**
 * Validate ObjectId
 * Checks if string is a valid MongoDB ObjectId
 */

import mongoose from "mongoose";

/**
 * Check if string is a valid MongoDB ObjectId
 * @param {String} id - ID to validate
 * @returns {Boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
