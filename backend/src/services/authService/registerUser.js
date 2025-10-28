/**
 * Register User
 * Handles user registration
 */

import User from "../../models/User/index.js";
import { generateToken } from "../../utils/tokenManager/index.js";
import {
  validateRequiredFields,
  validatePassword,
} from "../../utils/validators/index.js";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} Created user and token
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Validate required fields
  const validation = validateRequiredFields(userData, [
    "name",
    "email",
    "password",
  ]);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join(", "));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

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
