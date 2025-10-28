/**
 * Create Workspace
 * Creates a new workspace
 */

import Workspace from "../../models/Workspace/index.js";
import { validateRequiredFields } from "../../utils/validators/index.js";

/**
 * Create new workspace
 * @param {Object} workspaceData - Workspace data
 * @param {String} ownerId - Owner user ID
 * @returns {Object} Created workspace
 */
export const createWorkspace = async (workspaceData, ownerId) => {
  const { name, description, settings } = workspaceData;

  // Validate required fields
  const validation = validateRequiredFields(workspaceData, ["name"]);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  const workspace = await Workspace.create({
    name,
    description,
    owner: ownerId,
    members: [
      {
        user: ownerId,
        role: "owner",
      },
    ],
    settings: settings || {},
  });

  await workspace.populate("owner", "name email avatar");
  await workspace.populate("members.user", "name email avatar");

  return workspace;
};
