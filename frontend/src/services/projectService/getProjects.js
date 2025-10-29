import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getProjects = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROJECTS.LIST(workspaceId)
  );
  return ResponseNormalizer.normalizeList(response, "projects");
};
