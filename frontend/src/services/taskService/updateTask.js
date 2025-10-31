import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateTask = async (workspaceId, projectId, taskId, taskData) => {
  // Extract files and assigneeIds from taskData
  const { files, assigneeIds, ...rest } = taskData;

  // Build update payload, only include defined values
  const payload = { ...rest };

  // Add assigneeIds if provided
  if (assigneeIds !== undefined) {
    payload.assigneeIds = assigneeIds;
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
