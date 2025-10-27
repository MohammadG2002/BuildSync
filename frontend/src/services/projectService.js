import api from "./api";

export const getProjects = async (workspaceId) => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/projects`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProjectById = async (workspaceId, projectId) => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/projects/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createProject = async (workspaceId, projectData) => {
  try {
    const response = await api.post(
      `/workspaces/${workspaceId}/projects`,
      projectData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProject = async (workspaceId, projectId, projectData) => {
  try {
    const response = await api.put(
      `/workspaces/${workspaceId}/projects/${projectId}`,
      projectData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteProject = async (workspaceId, projectId) => {
  try {
    const response = await api.delete(
      `/workspaces/${workspaceId}/projects/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
