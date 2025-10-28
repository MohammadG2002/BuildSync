/**
 * Seed Users
 * Seeds users into database
 */

import User from "../../../models/User/index.js";

/**
 * Seed users
 */
export const seedUsers = async (usersData) => {
  console.log("Creating demo users...");
  return await User.create(usersData);
};
