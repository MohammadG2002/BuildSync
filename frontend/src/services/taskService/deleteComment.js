import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteComment = async (
  workspaceId,
  projectId,
  taskId,
  commentId
) => {
  const response = await apiClient.delete(
    `${API_ENDPOINTS.TASKS.GET(
      workspaceId,
      projectId,
      taskId
    )}/comments/${commentId}`
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
