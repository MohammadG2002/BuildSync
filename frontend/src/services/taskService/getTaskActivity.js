import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getTaskActivity = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.TASKS.ACTIVITY(workspaceId, projectId, taskId)
  );
  // Expecting { data: { items: [...] } }
  return ResponseNormalizer.normalizeList(response, "items");
};
