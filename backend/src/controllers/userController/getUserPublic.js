/**
 * Get Public User Profile
 * @route GET /api/users/:id
 * @access Public
 */

import { getUserById } from "../../services/authService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getUserPublic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  sendSuccess(res, 200, "User fetched successfully", { data: { user } });
});
