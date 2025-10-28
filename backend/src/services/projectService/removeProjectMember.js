/**
 * Remove Project Member
 * Removes a member from a project
 */

import Project from "../../models/Project/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Remove member from project
 * @param {String} projectId - Project ID
 * @param {String} memberUserId - User ID to remove
 * @param {String} requesterId - Requester user ID
 * @returns {Boolean} Success status
 */
export const removeProjectMember = async (
  projectId,
  memberUserId,
  requesterId
) => {
  if (!isValidObjectId(projectId) || !isValidObjectId(memberUserId)) {
    throw new Error("Invalid ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if requester is owner or admin
  const isOwner = project.owner.toString() === requesterId.toString();
  const member = project.members.find(
    (m) => m.user.toString() === requesterId.toString()
  );
  const canEdit =
    isOwner || (member && ["owner", "admin"].includes(member.role));

  if (!canEdit) {
    throw new Error("You do not have permission to remove members");
  }

  // Cannot remove owner
  if (project.owner.toString() === memberUserId) {
    throw new Error("Cannot remove project owner");
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== memberUserId
  );

  await project.save();

  return true;
};
