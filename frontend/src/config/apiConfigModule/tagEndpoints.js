/**
 * Tag Endpoints
 */
export const TAG_ENDPOINTS = {
  LIST: (workspaceId) =>
    workspaceId ? `/tags?workspace=${workspaceId}` : `/tags`,
  CREATE: () => `/tags`,
  UPDATE: (tagId) => `/tags/${tagId}`,
  DELETE: (tagId) => `/tags/${tagId}`,
};
