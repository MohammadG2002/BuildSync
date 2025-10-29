import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

// Backend returns: { success: true, data: { tasks: [...] } }
export const getTasks = async (workspaceId, projectId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.TASKS.LIST(workspaceId, projectId)
  );
  return ResponseNormalizer.normalizeList(response, "tasks");
};
