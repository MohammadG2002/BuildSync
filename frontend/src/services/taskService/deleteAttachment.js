import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteAttachment = async (
  workspaceId,
  projectId,
  taskId,
  attachmentId,
  options = {}
) => {
  const section = options.section;
  const query = section ? `?section=${encodeURIComponent(section)}` : "";
  const response = await apiClient.delete(
    `${API_ENDPOINTS.TASKS.GET(
      workspaceId,
      projectId,
      taskId
    )}/attachments/${attachmentId}${query}`
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
