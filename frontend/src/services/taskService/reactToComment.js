import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const reactToComment = async (
  workspaceId,
  projectId,
  taskId,
  commentId,
  action // 'like' | 'dislike' | 'clear'
) => {
  const response = await apiClient.patch(
    `${API_ENDPOINTS.TASKS.GET(
      workspaceId,
      projectId,
      taskId
    )}/comments/${commentId}/react`,
    { action }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
