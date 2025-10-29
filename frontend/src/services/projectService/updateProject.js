import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateProject = async (workspaceId, projectId, projectData) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PROJECTS.UPDATE(workspaceId, projectId),
    projectData
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};
