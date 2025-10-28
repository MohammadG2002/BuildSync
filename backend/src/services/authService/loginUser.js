/**
 * Login User
 * Handles user login
 */

import User from "../../models/User/index.js";
import { generateToken } from "../../utils/tokenManager/index.js";
import { validateRequiredFields } from "../../utils/validators/index.js";

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Object} User and token
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Validate required fields
  const validation = validateRequiredFields(credentials, ["email", "password"]);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error("Account is inactive. Please contact support.");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    token,
  };
};
