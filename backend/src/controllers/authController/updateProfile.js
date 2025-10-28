/**
 * Update Profile Controller
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */

import { updateUserProfile } from "../../services/authService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user._id, req.body);

  sendSuccess(res, 200, "Profile updated successfully", { data: { user } });
});
