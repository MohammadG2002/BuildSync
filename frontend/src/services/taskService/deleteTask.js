import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteTask = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.TASKS.DELETE(workspaceId, projectId, taskId)
  );
  return ResponseNormalizer.normalizeAction(response);
};
