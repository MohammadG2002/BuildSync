import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const addSubtask = async (
  workspaceId,
  projectId,
  taskId,
  titleOrPayload,
  options = {}
) => {
  const body =
    typeof titleOrPayload === "string"
      ? { title: titleOrPayload, ...options }
      : { ...titleOrPayload };
  const response = await apiClient.post(
    API_ENDPOINTS.TASKS.SUBTASKS(workspaceId, projectId, taskId),
    body
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
