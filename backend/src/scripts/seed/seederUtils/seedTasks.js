/**
 * Seed Tasks
 * Seeds tasks into database
 */

import Task from "../../../models/Task/index.js";

/**
 * Seed tasks
 */
export const seedTasks = async (tasksData) => {
  console.log("Creating demo tasks...");
  return await Task.create(tasksData);
};
