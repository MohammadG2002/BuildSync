import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getArchivedTasks = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.TASKS.ARCHIVED(workspaceId)
  );
  return ResponseNormalizer.normalizeList(response, "tasks");
};
