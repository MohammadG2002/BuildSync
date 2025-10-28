/**
 * Member Activity Broadcasting
 * Handles broadcasting member activity events
 */

import { broadcastToWorkspace } from "../scope/workspaceScopeBroadcast.js";

/**
 * Notify users of member activity
 * @param {String} workspaceId - Workspace ID
 * @param {Object} activity - Activity data
 */
export const broadcastMemberActivity = (workspaceId, activity) => {
  const message = {
    type: "member_activity",
    data: activity,
  };

  broadcastToWorkspace(workspaceId, message);
};
