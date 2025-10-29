import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getProjectById = async (workspaceId, projectId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROJECTS.GET(workspaceId, projectId)
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};
