import apiClient, { API_ENDPOINTS } from "./apiClient";

export const getWorkspaces = async () => {
  const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.LIST);
  // Backend returns: { success: true, data: { workspaces: [...] } }
  return response.data?.workspaces || response.data || response;
};

export const getWorkspaceById = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.WORKSPACES.GET(workspaceId)
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return response.data?.workspace || response.data || response;
};

export const createWorkspace = async (workspaceData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.CREATE,
    workspaceData
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return response.data?.workspace || response.data || response;
};

export const updateWorkspace = async (workspaceId, workspaceData) => {
  const response = await apiClient.put(
    API_ENDPOINTS.WORKSPACES.UPDATE(workspaceId),
    workspaceData
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return response.data?.workspace || response.data || response;
};

export const deleteWorkspace = async (workspaceId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.WORKSPACES.DELETE(workspaceId)
  );
  return response.data || response;
};

// Members
export const getWorkspaceMembers = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId)
  );
  return response.data?.members || response.data || response;
};

export const addWorkspaceMember = async (workspaceId, memberData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.ADD_MEMBER(workspaceId),
    memberData
  );
  return response.data?.member || response.data || response;
};

export const updateMemberRole = async (workspaceId, memberId, role) => {
  const response = await apiClient.put(
    API_ENDPOINTS.WORKSPACES.UPDATE_MEMBER(workspaceId, memberId),
    { role }
  );
  return response.data?.member || response.data || response;
};

export const removeMember = async (workspaceId, memberId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.WORKSPACES.REMOVE_MEMBER(workspaceId, memberId)
  );
  return response.data || response;
};
