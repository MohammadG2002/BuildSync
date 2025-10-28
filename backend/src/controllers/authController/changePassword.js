/**
 * Change Password Controller
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */

import { changeUserPassword } from "../../services/authService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const changePassword = asyncHandler(async (req, res) => {
  await changeUserPassword(req.user._id, req.body);

  sendSuccess(res, 200, "Password changed successfully");
});
