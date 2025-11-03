import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateComment = async (
  workspaceId,
  projectId,
  taskId,
  commentId,
  content
) => {
  const response = await apiClient.patch(
    `${API_ENDPOINTS.TASKS.GET(
      workspaceId,
      projectId,
      taskId
    )}/comments/${commentId}`,
    { content }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
