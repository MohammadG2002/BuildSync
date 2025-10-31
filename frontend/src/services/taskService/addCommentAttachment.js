import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const addCommentAttachment = async (
  workspaceId,
  projectId,
  taskId,
  commentId,
  file
) => {
  // Step 1: Upload the file to get the URL
  const formData = new FormData();
  formData.append("file", file);

  // Don't set Content-Type manually - browser sets it with boundary automatically
  const uploadResponse = await apiClient.post("/upload/attachment", formData);

  const uploadedFile = uploadResponse.data;

  // Step 2: Add the attachment metadata to the comment
  const response = await apiClient.post(
    `${API_ENDPOINTS.TASKS.GET(
      workspaceId,
      projectId,
      taskId
    )}/comments/${commentId}/attachments`,
    {
      name: uploadedFile.name,
      url: uploadedFile.url,
      size: uploadedFile.size,
      type: uploadedFile.type,
    }
  );

  return ResponseNormalizer.normalizeItem(response, "task");
};
