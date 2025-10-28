/**
 * Get User By ID
 * Retrieves user data by ID
 */

import User from "../../models/User/index.js";

/**
 * Get user by ID
 * @param {String} userId - User ID
 * @returns {Object} User data
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
  };
};
