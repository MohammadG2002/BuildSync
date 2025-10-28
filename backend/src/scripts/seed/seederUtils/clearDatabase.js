/**
 * Clear Database
 * Clears all existing data from database
 */

import User from "../../../models/User/index.js";
import Workspace from "../../../models/Workspace/index.js";
import Project from "../../../models/Project/index.js";
import Task from "../../../models/Task/index.js";

/**
 * Clear all existing data from database
 */
export const clearDatabase = async () => {
  console.log("Clearing existing data...");
  await User.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
};
