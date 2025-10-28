/**
 * Logout Controller
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */

import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // Here we can optionally blacklist the token or clear refresh tokens

  sendSuccess(res, 200, "Logged out successfully");
});
