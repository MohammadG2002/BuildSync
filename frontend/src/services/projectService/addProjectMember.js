import apiClient from "../apiClient";
import { ResponseNormalizer } from "../shared";

/**
 * Add member to project
 * @param {string} workspaceId - Workspace ID
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID to add
 * @returns {Promise} Updated project
 */
export const addProjectMember = async (workspaceId, projectId, userId) => {
  const response = await apiClient.post(`/projects/${projectId}/members`, {
    userId,
  });
  return ResponseNormalizer.normalizeItem(response, "project");
};
