import apiClient, { API_ENDPOINTS } from "./apiClient";
import { ResponseNormalizer } from "./shared";

// Backend returns: { success: true, data: { projects: [...] } } or { data: { project: {...} } }
export const getProjects = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROJECTS.LIST(workspaceId)
  );
  return ResponseNormalizer.normalizeList(response, "projects");
};

export const getProjectById = async (workspaceId, projectId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROJECTS.GET(workspaceId, projectId)
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};

export const createProject = async (workspaceId, projectData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROJECTS.CREATE(workspaceId),
    { ...projectData, workspace: workspaceId }
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};

export const updateProject = async (workspaceId, projectId, projectData) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PROJECTS.UPDATE(workspaceId, projectId),
    projectData
  );
  return ResponseNormalizer.normalizeItem(response, "project");
};

export const deleteProject = async (workspaceId, projectId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.PROJECTS.DELETE(workspaceId, projectId)
  );
  return ResponseNormalizer.normalizeAction(response);
};
