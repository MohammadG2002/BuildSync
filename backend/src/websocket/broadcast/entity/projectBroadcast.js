/**
 * Project Update Broadcasting
 * Handles broadcasting project-related updates
 */

import { broadcastToWorkspace } from "../scope/workspaceScopeBroadcast.js";

/**
 * Send project update to relevant users
 * @param {Object} project - Project data
 * @param {String} action - Action type (created, updated, deleted)
 */
export const broadcastProjectUpdate = (project, action) => {
  const message = {
    type: "project_update",
    action,
    data: project,
  };

  if (project.workspace) {
    broadcastToWorkspace(project.workspace.toString(), message);
  }
};
