/**
 * Get Projects
 * Retrieves all projects with filters
 */

import Project from "../../models/Project/index.js";
import Task from "../../models/Task/index.js";
import { buildUserAccessQuery } from "../../utils/queryBuilder/index.js";

/**
 * Get all projects with filters
 * @param {Object} filters - Filter options
 * @param {String} userId - User ID
 * @returns {Array} Projects with statistics
 */
export const getProjects = async (filters, userId) => {
  const { workspace, status, priority, isArchived } = filters;

  if (!workspace) {
    throw new Error("Workspace ID is required");
  }

  // Build query
  const query = {
    workspace,
    ...buildUserAccessQuery(userId),
  };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (isArchived !== undefined) query.isArchived = isArchived === "true";

  const projects = await Project.find(query)
    .populate("owner", "name email avatar")
    .populate("workspace", "name")
    .populate("members.user", "name email avatar")
    .sort({ createdAt: -1 });

  // Get task counts for each project
  const projectsWithCounts = await Promise.all(
    projects.map(async (project) => {
      const tasksCount = await Task.countDocuments({ project: project._id });
      const completedTasksCount = await Task.countDocuments({
        project: project._id,
        status: "completed",
      });

      return {
        ...project.toObject(),
        tasksCount,
        completedTasksCount,
        progress:
          tasksCount > 0
            ? Math.round((completedTasksCount / tasksCount) * 100)
            : 0,
      };
    })
  );

  return projectsWithCounts;
};
