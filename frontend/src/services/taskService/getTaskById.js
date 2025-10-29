import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getTaskById = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.TASKS.GET(workspaceId, projectId, taskId)
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
