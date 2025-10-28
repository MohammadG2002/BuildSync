/**
 * Project Endpoints
 */
export const PROJECT_ENDPOINTS = {
  LIST: (workspaceId) => `/projects?workspace=${workspaceId}`,
  CREATE: (workspaceId) => `/projects`,
  GET: (workspaceId, projectId) => `/projects/${projectId}`,
  UPDATE: (workspaceId, projectId) => `/projects/${projectId}`,
  DELETE: (workspaceId, projectId) => `/projects/${projectId}`,
};
