/**
 * Get Current User Controller
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */

import { getUserById } from "../../services/authService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user._id);

  sendSuccess(res, 200, "User data fetched successfully", { data: { user } });
});
