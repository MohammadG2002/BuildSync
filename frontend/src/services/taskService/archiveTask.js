import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const archiveTask = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.put(
    API_ENDPOINTS.TASKS.ARCHIVE(workspaceId, projectId, taskId)
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
