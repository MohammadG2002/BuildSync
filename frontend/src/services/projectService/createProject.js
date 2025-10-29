import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const createProject = async (workspaceId, projectData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROJECTS.CREATE(workspaceId),
    { ...projectData, workspace: workspaceId }
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};
