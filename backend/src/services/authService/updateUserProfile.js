/**
 * Update User Profile
 * Updates user profile information
 */

import User from "../../models/User/index.js";

/**
 * Update user profile
 * @param {String} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated user
 */
export const updateUserProfile = async (userId, updateData) => {
  const { name, avatar } = updateData;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
};
