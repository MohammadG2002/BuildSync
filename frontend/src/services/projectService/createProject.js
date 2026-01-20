import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const createProject = async (workspaceId, projectData) => {
  // Convert date strings to ISO format
  const payload = {
    ...projectData,
    workspace: workspaceId,
  };

  // Convert YYYY-MM-DD to ISO 8601 datetime
  if (payload.startDate && typeof payload.startDate === "string") {
    payload.startDate = new Date(payload.startDate).toISOString();
  }
  if (payload.dueDate && typeof payload.dueDate === "string") {
    payload.dueDate = new Date(payload.dueDate).toISOString();
  }

  const response = await apiClient.post(
    API_ENDPOINTS.PROJECTS.CREATE(workspaceId),
    payload,
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};
