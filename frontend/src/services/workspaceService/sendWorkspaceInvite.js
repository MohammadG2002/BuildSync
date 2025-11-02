import apiClient, { API_ENDPOINTS } from "../apiClient";

export const sendWorkspaceInvite = async (workspaceId, inviteData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.INVITES(workspaceId),
    inviteData
  );
  return response.data?.notification || null;
};
