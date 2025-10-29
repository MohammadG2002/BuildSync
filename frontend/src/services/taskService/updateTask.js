import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateTask = async (workspaceId, projectId, taskId, taskData) => {
  // Map assigneeId to assignedTo for backend compatibility
  const { assigneeId, files, ...rest } = taskData;

  // Build update payload, only include defined values
  const payload = { ...rest };
  if (assigneeId !== undefined) {
    payload.assignedTo = assigneeId;
  }

  // Remove undefined values
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  const response = await apiClient.put(
    API_ENDPOINTS.TASKS.UPDATE(workspaceId, projectId, taskId),
    payload
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
