import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const createTask = async (workspaceId, projectId, taskData) => {
  // Map assigneeId to assignedTo for backend compatibility
  const { assigneeId, ...rest } = taskData;
  const response = await apiClient.post(
    API_ENDPOINTS.TASKS.CREATE(workspaceId, projectId),
    {
      ...rest,
      project: projectId,
      workspace: workspaceId,
      assignedTo: assigneeId || undefined,
    }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
