/**
 * Add Project Member
 * Adds a member to a project
 */

import Project from "../../models/Project/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Add member to project
 * @param {String} projectId - Project ID
 * @param {Object} memberData - Member data (userId, role)
 * @param {String} requesterId - Requester user ID
 * @returns {Object} Updated project
 */
export const addProjectMember = async (projectId, memberData, requesterId) => {
  if (!isValidObjectId(projectId)) {
    throw new Error("Invalid project ID");
  }

  const { userId, role = "member" } = memberData;

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
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
    throw new Error("You do not have permission to add members");
  }

  // Check if user is already a member
  if (project.members.some((m) => m.user.toString() === userId)) {
    throw new Error("User is already a member of this project");
  }

  project.members.push({ user: userId, role });
  await project.save();
  await project.populate("members.user", "name email avatar");

  return project;
};
