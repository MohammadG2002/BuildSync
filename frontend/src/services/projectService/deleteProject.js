import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteProject = async (workspaceId, projectId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.PROJECTS.DELETE(workspaceId, projectId)
  );
  return ResponseNormalizer.normalizeAction(response);
};
