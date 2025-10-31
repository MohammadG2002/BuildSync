import apiClient from "../apiClient";
import { ResponseNormalizer } from "../shared";

/**
 * Get workspace members
 * @param {string} workspaceId - Workspace ID
 * @returns {Promise} Members data
 */
export const getWorkspaceMembers = async (workspaceId) => {
  const response = await apiClient.get(`/members/workspace/${workspaceId}`);
  // Backend returns: { success: true, data: { members: [{id, name, email, avatar, role, joinedAt, lastLogin}] } }
  return ResponseNormalizer.normalizeList(response, "members");
};
