import apiClient from "../apiClient";
import { ResponseNormalizer } from "../shared";

/**
 * Remove member from project
 * @param {string} workspaceId - Workspace ID (unused by API path but kept for parity)
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID to remove
 * @returns {Promise<boolean>} success flag
 */
export const removeProjectMember = async (workspaceId, projectId, userId) => {
  const response = await apiClient.delete(
    `/projects/${projectId}/members/${userId}`
  );
  const data = ResponseNormalizer.normalizeAction(response);
  return data?.success ?? true;
};
