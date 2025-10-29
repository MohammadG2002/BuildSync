import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteAttachment = async (
  workspaceId,
  projectId,
  taskId,
  attachmentId
) => {
  const response = await apiClient.delete(
    `${API_ENDPOINTS.TASKS.GET(
      workspaceId,
      projectId,
      taskId
    )}/attachments/${attachmentId}`
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
