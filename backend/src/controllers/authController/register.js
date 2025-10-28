/**
 * Register Controller
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */

import { registerUser } from "../../services/authService/index.js";
import { sendCreated } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  sendCreated(res, "User registered successfully", { data: result });
});
