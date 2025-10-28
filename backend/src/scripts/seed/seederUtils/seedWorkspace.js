/**
 * Seed Workspace
 * Seeds workspace into database
 */

import Workspace from "../../../models/Workspace/index.js";

/**
 * Seed workspace
 */
export const seedWorkspace = async (workspaceData) => {
  console.log("Creating demo workspace...");
  return await Workspace.create(workspaceData);
};
