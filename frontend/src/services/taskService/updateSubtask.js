import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateSubtask = async (
  workspaceId,
  projectId,
  taskId,
  subtaskId,
  payload
) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.TASKS.SUBTASK(workspaceId, projectId, taskId, subtaskId),
    payload
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
