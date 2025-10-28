/**
 * Create Project
 * Creates a new project
 */

import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";
import {
  validateRequiredFields,
  validateDateRange,
} from "../../utils/validators/index.js";

/**
 * Create new project
 * @param {Object} projectData - Project data
 * @param {String} userId - Creator user ID
 * @returns {Object} Created project
 */
export const createProject = async (projectData, userId) => {
  const {
    name,
    description,
    workspace,
    status,
    priority,
    startDate,
    dueDate,
    members,
    tags,
    color,
  } = projectData;

  // Validate required fields
  const validation = validateRequiredFields(projectData, ["name", "workspace"]);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  // Validate date range if both dates provided
  if (startDate && dueDate) {
    const dateValidation = validateDateRange(startDate, dueDate);
    if (!dateValidation.isValid) {
      throw new Error(dateValidation.errors.join(", "));
    }
  }

  // Check if workspace exists and user is a member
  const workspaceDoc = await Workspace.findById(workspace);
  if (!workspaceDoc) {
    throw new Error("Workspace not found");
  }

  if (!workspaceDoc.isMember(userId)) {
    throw new Error("You are not a member of this workspace");
  }

  const project = await Project.create({
    name,
    description,
    workspace,
    owner: userId,
    status: status || "planning",
    priority: priority || "medium",
    startDate,
    dueDate,
    members: members || [{ user: userId, role: "owner" }],
    tags: tags || [],
    color: color || "#3B82F6",
  });

  await project.populate("owner", "name email avatar");
  await project.populate("workspace", "name");
  await project.populate("members.user", "name email avatar");

  return project;
};
