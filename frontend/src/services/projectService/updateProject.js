import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateProject = async (workspaceId, projectId, projectData) => {
  // Convert date strings to ISO format
  const payload = { ...projectData };

  // Convert YYYY-MM-DD to ISO 8601 datetime
  if (payload.startDate && typeof payload.startDate === "string") {
    payload.startDate = new Date(payload.startDate).toISOString();
  }
  if (payload.dueDate && typeof payload.dueDate === "string") {
    payload.dueDate = new Date(payload.dueDate).toISOString();
  }

  const response = await apiClient.put(
    API_ENDPOINTS.PROJECTS.UPDATE(workspaceId, projectId),
    payload,
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};
