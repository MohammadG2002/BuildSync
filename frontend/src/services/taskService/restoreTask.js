import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const restoreTask = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.put(
    API_ENDPOINTS.TASKS.RESTORE(workspaceId, projectId, taskId)
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
