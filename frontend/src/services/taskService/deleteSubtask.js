import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteSubtask = async (
  workspaceId,
  projectId,
  taskId,
  subtaskId
) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.TASKS.SUBTASK(workspaceId, projectId, taskId, subtaskId)
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
