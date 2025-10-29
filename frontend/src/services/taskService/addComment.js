import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const addComment = async (workspaceId, projectId, taskId, content) => {
  const response = await apiClient.post(
    `${API_ENDPOINTS.TASKS.GET(workspaceId, projectId, taskId)}/comments`,
    { content }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
