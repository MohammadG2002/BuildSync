/**
 * Get Projects
 * Retrieves all projects with filters
 */

import Project from "../../models/Project/index.js";
import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";
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

  // Determine workspace role to shape access
  const ws = await Workspace.findById(workspace);
  if (!ws) {
    throw new Error("Workspace not found");
  }
  const role = ws.getUserRole?.(userId) || null;

  // Build query: owners/admins can see all projects in workspace; others only projects they own or are members of
  const query = { workspace };
  if (!(role === "owner" || role === "admin")) {
    Object.assign(query, buildUserAccessQuery(userId));
  }

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
      const blockedTasksCount = await Task.countDocuments({
        project: project._id,
        status: "blocked",
      });
      const totalExcludingBlocked = await Task.countDocuments({
        project: project._id,
        status: { $ne: "blocked" },
      });
      const completedTasksCount = await Task.countDocuments({
        project: project._id,
        status: { $in: ["completed", "done"] },
      });

      const progress =
        totalExcludingBlocked > 0
          ? Math.round((completedTasksCount / totalExcludingBlocked) * 100)
          : 0;

      return {
        ...project.toObject(),
        tasksCount,
        blockedTasksCount,
        totalExcludingBlocked,
        completedTasksCount,
        progress,
      };
    })
  );

  return projectsWithCounts;
};
