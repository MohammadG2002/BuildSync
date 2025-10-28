/**
 * Task Endpoints
 */
export const TASK_ENDPOINTS = {
  LIST: (workspaceId, projectId) => `/tasks?project=${projectId}`,
  CREATE: (workspaceId, projectId) => `/tasks`,
  GET: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
  UPDATE: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
  DELETE: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
  ARCHIVE: (workspaceId, projectId, taskId) => `/tasks/${taskId}/archive`,
  ARCHIVED: (workspaceId) => `/tasks/archived?workspace=${workspaceId}`,
};
