import apiClient, { API_ENDPOINTS } from "./apiClient";
import { ResponseNormalizer } from "./shared";

export const getWorkspaces = async () => {
  const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.LIST);
  // Backend returns: { success: true, data: { workspaces: [...] } }
  return ResponseNormalizer.normalizeList(response, "workspaces");
};

export const getWorkspaceById = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.WORKSPACES.GET(workspaceId)
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return ResponseNormalizer.normalizeItem(response, "workspace");
};

export const createWorkspace = async (workspaceData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.CREATE,
    workspaceData
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return ResponseNormalizer.normalizeItem(response, "workspace");
};

export const updateWorkspace = async (workspaceId, workspaceData) => {
  const response = await apiClient.put(
    API_ENDPOINTS.WORKSPACES.UPDATE(workspaceId),
    workspaceData
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return ResponseNormalizer.normalizeItem(response, "workspace");
};

export const deleteWorkspace = async (workspaceId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.WORKSPACES.DELETE(workspaceId)
  );
  return ResponseNormalizer.normalizeAction(response);
};

// Members
export const getWorkspaceMembers = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId)
  );
  return ResponseNormalizer.normalizeList(response, "members");
};

export const addWorkspaceMember = async (workspaceId, memberData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.ADD_MEMBER(workspaceId),
    memberData
  );
  return ResponseNormalizer.normalizeItem(response, "member");
};

export const updateMemberRole = async (workspaceId, memberId, role) => {
  const response = await apiClient.put(
    API_ENDPOINTS.WORKSPACES.UPDATE_MEMBER(workspaceId, memberId),
    { role }
  );
  return ResponseNormalizer.normalizeItem(response, "member");
};

export const removeMember = async (workspaceId, memberId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.WORKSPACES.REMOVE_MEMBER(workspaceId, memberId)
  );
  return ResponseNormalizer.normalizeAction(response);
};
