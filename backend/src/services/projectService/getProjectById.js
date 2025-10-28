/**
 * Get Project By ID
 * Retrieves project by ID with statistics
 */

import Project from "../../models/Project/index.js";
import Task from "../../models/Task/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Get project by ID with statistics
 * @param {String} projectId - Project ID
 * @param {String} userId - User ID (for access check)
 * @returns {Object} Project with statistics
 */
export const getProjectById = async (projectId, userId) => {
  if (!isValidObjectId(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await Project.findById(projectId)
    .populate("owner", "name email avatar")
    .populate("workspace", "name")
    .populate("members.user", "name email avatar");

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user has access
  const isOwner = project.owner._id.toString() === userId.toString();
  const isMember = project.members.some(
    (member) => member.user._id.toString() === userId.toString()
  );

  if (!isOwner && !isMember) {
    throw new Error("Access denied");
  }

  // Get task statistics
  const tasksCount = await Task.countDocuments({ project: project._id });
  const completedTasksCount = await Task.countDocuments({
    project: project._id,
    status: "completed",
  });
  const tasksCountByStatus = await Task.aggregate([
    { $match: { project: project._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return {
    ...project.toObject(),
    tasksCount,
    completedTasksCount,
    progress:
      tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0,
    tasksCountByStatus: tasksCountByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
};
