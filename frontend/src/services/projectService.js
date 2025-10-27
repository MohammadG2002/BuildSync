import apiClient, { API_ENDPOINTS } from "./apiClient";

export const getProjects = async (workspaceId) => {
  return await apiClient.get(API_ENDPOINTS.PROJECT.LIST(workspaceId));
};

export const getProjectById = async (workspaceId, projectId) => {
  return await apiClient.get(
    API_ENDPOINTS.PROJECT.DETAIL(workspaceId, projectId)
  );
};

export const createProject = async (workspaceId, projectData) => {
  return await apiClient.post(
    API_ENDPOINTS.PROJECT.CREATE(workspaceId),
    projectData
  );
};

export const updateProject = async (workspaceId, projectId, projectData) => {
  return await apiClient.put(
    API_ENDPOINTS.PROJECT.UPDATE(workspaceId, projectId),
    projectData
  );
};

export const deleteProject = async (workspaceId, projectId) => {
  return await apiClient.delete(
    API_ENDPOINTS.PROJECT.DELETE(workspaceId, projectId)
  );
};
