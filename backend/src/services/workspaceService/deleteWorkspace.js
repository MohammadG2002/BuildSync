/**
 * Delete Workspace
 * Soft deletes a workspace
 */

import Workspace from "../../models/Workspace/index.js";
import Project from "../../models/Project/index.js";
import Task from "../../models/Task/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Delete (soft delete) workspace
 * @param {String} workspaceId - Workspace ID
 * @param {String} userId - User ID (for permission check)
 * @returns {Boolean} Success status
 */
export const deleteWorkspace = async (workspaceId, userId) => {
  if (!isValidObjectId(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if user is owner
  if (workspace.owner.toString() !== userId.toString()) {
    throw new Error("Only workspace owner can delete workspace");
  }

  // Soft delete workspace
  workspace.isActive = false;
  await workspace.save();

  // Cascade: find all projects for this workspace and delete their tasks, then archive projects
  const projects = await Project.find({ workspace: workspace._id }).select("_id");
  const projectIds = projects.map((p) => p._id);
  if (projectIds.length) {
    // Delete all tasks for these projects (including archived)
    await Task.deleteMany({ project: { $in: projectIds } });
    // Archive all projects (soft delete); if hard delete desired, use deleteMany instead
    await Project.updateMany(
      { _id: { $in: projectIds } },
      { $set: { isArchived: true } }
    );
  }

  return true;
};
