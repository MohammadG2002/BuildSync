/**
 * Find User By Email
 * Finds user by email address
 */

import User from "../../models/User/index.js";

/**
 * Find user by email
 * @param {String} email - User email
 * @returns {Object} User data or null
 */
export const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return null;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
};
