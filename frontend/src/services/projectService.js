import apiClient, { API_ENDPOINTS } from "./apiClient";

// Backend returns: { success: true, data: { projects: [...] } } or { data: { project: {...} } }
export const getProjects = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROJECTS.LIST(workspaceId)
  );
  return response.data?.projects || response.data || response;
};

export const getProjectById = async (workspaceId, projectId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROJECTS.GET(workspaceId, projectId)
  );
  return response.data?.project || response.data || response;
};

export const createProject = async (workspaceId, projectData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROJECTS.CREATE(workspaceId),
    { ...projectData, workspace: workspaceId }
  );
  return response.data?.project || response.data || response;
};

export const updateProject = async (workspaceId, projectId, projectData) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PROJECTS.UPDATE(workspaceId, projectId),
    projectData
  );
  return response.data?.project || response.data || response;
};

export const deleteProject = async (workspaceId, projectId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.PROJECTS.DELETE(workspaceId, projectId)
  );
  return response.data || response;
};
