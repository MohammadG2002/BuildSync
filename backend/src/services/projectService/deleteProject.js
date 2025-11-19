/**
 * Delete Project
 * Archives a project (soft delete)
 */

import Project from "../../models/Project/index.js";
import Task from "../../models/Task/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Delete (archive) project
 * @param {String} projectId - Project ID
 * @param {String} userId - User ID (for permission check)
 * @returns {Boolean} Success status
 */
export const deleteProject = async (projectId, userId) => {
  if (!isValidObjectId(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user is owner
  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can delete project");
  }

  // Soft delete by archiving the project
  project.isArchived = true;
  await project.save();

  // Cascade delete all tasks (including archived) belonging to this project
  // Using deleteMany for performance; if future audit needed, replace with archival.
  await Task.deleteMany({ project: project._id });

  return true;
};
