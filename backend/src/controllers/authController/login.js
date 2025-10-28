/**
 * Login Controller
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */

import { loginUser } from "../../services/authService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  sendSuccess(res, 200, "Login successful", { data: result });
});
