/**
 * Task Endpoints
 */
export const TASK_ENDPOINTS = {
  LIST: (workspaceId, projectId) => {
    if (projectId) {
      return `/tasks?project=${projectId}`;
    } else if (workspaceId) {
      return `/tasks?workspace=${workspaceId}`;
    }
    return `/tasks`;
  },
  CREATE: (workspaceId, projectId) => `/tasks`,
  GET: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
  UPDATE: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
  DELETE: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
  ARCHIVE: (workspaceId, projectId, taskId) => `/tasks/${taskId}/archive`,
  ARCHIVED: (workspaceId) => `/tasks/archived?workspace=${workspaceId}`,
};
