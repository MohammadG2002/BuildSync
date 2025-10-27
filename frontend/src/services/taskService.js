import apiClient, { API_ENDPOINTS } from "./apiClient";

export const getTasks = async (workspaceId, projectId) => {
  return await apiClient.get(API_ENDPOINTS.TASK.LIST(workspaceId, projectId));
};

export const getTaskById = async (workspaceId, projectId, taskId) => {
  return await apiClient.get(
    API_ENDPOINTS.TASK.DETAIL(workspaceId, projectId, taskId)
  );
};

export const createTask = async (workspaceId, projectId, taskData) => {
  return await apiClient.post(
    API_ENDPOINTS.TASK.CREATE(workspaceId, projectId),
    taskData
  );
};

export const updateTask = async (workspaceId, projectId, taskId, taskData) => {
  return await apiClient.put(
    API_ENDPOINTS.TASK.UPDATE(workspaceId, projectId, taskId),
    taskData
  );
};

export const deleteTask = async (workspaceId, projectId, taskId) => {
  return await apiClient.delete(
    API_ENDPOINTS.TASK.DELETE(workspaceId, projectId, taskId)
  );
};

export const archiveTask = async (workspaceId, projectId, taskId) => {
  return await apiClient.put(
    API_ENDPOINTS.TASK.ARCHIVE(workspaceId, projectId, taskId)
  );
};

export const getArchivedTasks = async (workspaceId) => {
  return await apiClient.get(`/workspaces/${workspaceId}/tasks/archived`);
};
