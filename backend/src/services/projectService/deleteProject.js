/**
 * Delete Project
 * Archives a project (soft delete)
 */

import Project from "../../models/Project/index.js";
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

  // Soft delete by archiving
  project.isArchived = true;
  await project.save();

  return true;
};
