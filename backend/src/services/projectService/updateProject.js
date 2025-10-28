/**
 * Update Project
 * Updates an existing project
 */

import Project from "../../models/Project/index.js";
import {
  isValidObjectId,
  validateDateRange,
} from "../../utils/validators/index.js";

/**
 * Update project
 * @param {String} projectId - Project ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - User ID (for permission check)
 * @returns {Object} Updated project
 */
export const updateProject = async (projectId, updateData, userId) => {
  if (!isValidObjectId(projectId)) {
    throw new Error("Invalid project ID");
  }

  const {
    name,
    description,
    status,
    priority,
    startDate,
    dueDate,
    tags,
    color,
  } = updateData;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user is owner or member with admin role
  const isOwner = project.owner.toString() === userId.toString();
  const member = project.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  const canEdit =
    isOwner || (member && ["owner", "admin"].includes(member.role));

  if (!canEdit) {
    throw new Error("You do not have permission to update this project");
  }

  // Validate date range if both dates provided
  const newStartDate = startDate !== undefined ? startDate : project.startDate;
  const newDueDate = dueDate !== undefined ? dueDate : project.dueDate;

  if (newStartDate && newDueDate) {
    const dateValidation = validateDateRange(newStartDate, newDueDate);
    if (!dateValidation.isValid) {
      throw new Error(dateValidation.errors.join(", "));
    }
  }

  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  if (priority) project.priority = priority;
  if (startDate !== undefined) project.startDate = startDate;
  if (dueDate !== undefined) project.dueDate = dueDate;
  if (tags) project.tags = tags;
  if (color) project.color = color;

  await project.save();
  await project.populate("owner", "name email avatar");
  await project.populate("workspace", "name");
  await project.populate("members.user", "name email avatar");

  return project;
};
