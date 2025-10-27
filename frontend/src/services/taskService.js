import api from "./api";

export const getTasks = async (workspaceId, projectId) => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTaskById = async (workspaceId, projectId, taskId) => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createTask = async (workspaceId, projectId, taskData) => {
  try {
    const response = await api.post(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
      taskData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateTask = async (workspaceId, projectId, taskId, taskData) => {
  try {
    const response = await api.put(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
      taskData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteTask = async (workspaceId, projectId, taskId) => {
  try {
    const response = await api.delete(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const archiveTask = async (workspaceId, projectId, taskId) => {
  try {
    const response = await api.put(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/archive`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getArchivedTasks = async (workspaceId) => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/tasks/archived`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
