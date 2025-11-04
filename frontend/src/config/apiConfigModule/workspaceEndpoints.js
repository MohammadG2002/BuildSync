/**
 * Workspace Endpoints
 */
export const WORKSPACE_ENDPOINTS = {
  LIST: "/workspaces",
  CREATE: "/workspaces",
  GET: (id) => `/workspaces/${id}`,
  UPDATE: (id) => `/workspaces/${id}`,
  DELETE: (id) => `/workspaces/${id}`,
  MEMBERS: (id) => `/members/workspace/${id}`,
  ADD_MEMBER: (id) => `/workspaces/${id}/members`,
  UPDATE_MEMBER: (workspaceId, memberId) =>
    `/members/workspace/${workspaceId}/${memberId}`,
  REMOVE_MEMBER: (workspaceId, memberId) =>
    `/workspaces/${workspaceId}/members/${memberId}`,
  TRANSFER_OWNERSHIP: (id) => `/workspaces/${id}/transfer-ownership`,
  INVITES: (id) => `/workspaces/${id}/invites`,
  INVITE_ACCEPT: (id, notificationId) =>
    `/workspaces/${id}/invites/${notificationId}/accept`,
  INVITE_DECLINE: (id, notificationId) =>
    `/workspaces/${id}/invites/${notificationId}/decline`,
};
