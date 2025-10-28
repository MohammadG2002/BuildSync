import apiClient, { API_ENDPOINTS } from "./apiClient";
import { ResponseNormalizer } from "./shared";

// Backend returns: { success: true, data: { tasks: [...] } } or { data: { task: {...} } }
export const getTasks = async (workspaceId, projectId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.TASKS.LIST(workspaceId, projectId)
  );
  return ResponseNormalizer.normalizeList(response, "tasks");
};

export const getTaskById = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.TASKS.GET(workspaceId, projectId, taskId)
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};

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

export const updateTask = async (workspaceId, projectId, taskId, taskData) => {
  // Map assigneeId to assignedTo for backend compatibility
  const { assigneeId, files, ...rest } = taskData;

  // Build update payload, only include defined values
  const payload = { ...rest };
  if (assigneeId !== undefined) {
    payload.assignedTo = assigneeId;
  }

  // Remove undefined values
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  const response = await apiClient.put(
    API_ENDPOINTS.TASKS.UPDATE(workspaceId, projectId, taskId),
    payload
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};

export const deleteTask = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.TASKS.DELETE(workspaceId, projectId, taskId)
  );
  return ResponseNormalizer.normalizeAction(response);
};

export const archiveTask = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.put(
    API_ENDPOINTS.TASKS.ARCHIVE(workspaceId, projectId, taskId)
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};

export const getArchivedTasks = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.TASKS.ARCHIVED(workspaceId)
  );
  return ResponseNormalizer.normalizeList(response, "tasks");
};

export const addComment = async (workspaceId, projectId, taskId, content) => {
  const response = await apiClient.post(
    `${API_ENDPOINTS.TASKS.GET(workspaceId, projectId, taskId)}/comments`,
    { content }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};

export const addAttachment = async (workspaceId, projectId, taskId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(
    `${API_ENDPOINTS.TASKS.GET(workspaceId, projectId, taskId)}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};

export const deleteAttachment = async (
  workspaceId,
  projectId,
  taskId,
  attachmentId
) => {
  const response = await apiClient.delete(
    `${API_ENDPOINTS.TASKS.GET(
      workspaceId,
      projectId,
      taskId
    )}/attachments/${attachmentId}`
  );
  return ResponseNormalizer.normalizeItem(response, "task");
};
