import apiClient, { API_ENDPOINTS } from "./apiClient";

export const getWorkspaces = async () => {
  return await apiClient.get(API_ENDPOINTS.WORKSPACE.LIST);
};

export const getWorkspaceById = async (workspaceId) => {
  return await apiClient.get(API_ENDPOINTS.WORKSPACE.DETAIL(workspaceId));
};

export const createWorkspace = async (workspaceData) => {
  return await apiClient.post(API_ENDPOINTS.WORKSPACE.CREATE, workspaceData);
};

export const updateWorkspace = async (workspaceId, workspaceData) => {
  return await apiClient.put(
    API_ENDPOINTS.WORKSPACE.UPDATE(workspaceId),
    workspaceData
  );
};

export const deleteWorkspace = async (workspaceId) => {
  return await apiClient.delete(API_ENDPOINTS.WORKSPACE.DELETE(workspaceId));
};

// Members
export const getWorkspaceMembers = async (workspaceId) => {
  return await apiClient.get(API_ENDPOINTS.MEMBER.LIST(workspaceId));
};

export const addWorkspaceMember = async (workspaceId, memberData) => {
  return await apiClient.post(
    API_ENDPOINTS.MEMBER.ADD(workspaceId),
    memberData
  );
};

export const updateMemberRole = async (workspaceId, memberId, role) => {
  return await apiClient.put(
    API_ENDPOINTS.MEMBER.UPDATE_ROLE(workspaceId, memberId),
    { role }
  );
};

export const removeMember = async (workspaceId, memberId) => {
  return await apiClient.delete(
    API_ENDPOINTS.MEMBER.REMOVE(workspaceId, memberId)
  );
};
