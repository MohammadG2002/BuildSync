/**
 * Task Update Broadcasting
 * Handles broadcasting task-related updates
 */

import { broadcastToWorkspace } from "../scope/workspaceScopeBroadcast.js";
import { broadcastToProject } from "../scope/projectScopeBroadcast.js";

/**
 * Send task update to relevant users
 * @param {Object} task - Task data
 * @param {String} action - Action type (created, updated, deleted)
 */
export const broadcastTaskUpdate = (task, action) => {
  const message = {
    type: "task_update",
    action,
    data: task,
  };

  if (task.workspace) {
    broadcastToWorkspace(task.workspace.toString(), message);
  } else if (task.project) {
    broadcastToProject(task.project.toString(), message);
  }
};
