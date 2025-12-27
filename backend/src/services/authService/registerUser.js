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
    // If email verified and active, user is already registered
    if (existingUser.isEmailVerified && existingUser.isActive) {
      throw new Error("User already exists with this email");
    }
    // If email is verified but not active (completed verification step), update user info
    if (existingUser.isEmailVerified && !existingUser.isActive) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.isActive = true;
      existingUser.emailVerificationCode = undefined;
      existingUser.emailVerificationExpires = undefined;
      await existingUser.save();

      const token = generateToken(existingUser._id);
      return {
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          avatar: existingUser.avatar,
          role: existingUser.role,
        },
        token,
      };
    }
    // If not verified, they haven't completed verification
    if (!existingUser.isEmailVerified) {
      throw new Error(
        "Email verification pending. Please complete verification first"
      );
    }
  }

  // Create user (ensure active)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    isActive: true,
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
