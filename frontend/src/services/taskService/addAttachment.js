import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const addAttachment = async (workspaceId, projectId, taskId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(
    `${API_ENDPOINTS.TASKS.GET(workspaceId, projectId, taskId)}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
