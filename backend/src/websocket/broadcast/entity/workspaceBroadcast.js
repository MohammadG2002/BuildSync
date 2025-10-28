/**
 * Workspace Update Broadcasting
 * Handles broadcasting workspace-related updates
 */

import { broadcastToWorkspace } from "../scope/workspaceScopeBroadcast.js";

/**
 * Send workspace update to relevant users
 * @param {Object} workspace - Workspace data
 * @param {String} action - Action type (created, updated, deleted)
 */
export const broadcastWorkspaceUpdate = (workspace, action) => {
  const message = {
    type: "workspace_update",
    action,
    data: workspace,
  };

  broadcastToWorkspace(workspace._id.toString(), message);
};
