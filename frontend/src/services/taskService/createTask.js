import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const createTask = async (workspaceId, projectId, taskData) => {
  // Backend expects assigneeIds (array). Pass through if provided.
  // Ensure required linkage fields are present.
  const response = await apiClient.post(
    API_ENDPOINTS.TASKS.CREATE(workspaceId, projectId),
    {
      ...taskData,
      project: projectId,
      workspace: workspaceId,
    }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
