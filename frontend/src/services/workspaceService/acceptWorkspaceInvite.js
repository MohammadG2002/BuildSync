import apiClient, { API_ENDPOINTS } from "../apiClient";

export const acceptWorkspaceInvite = async (workspaceId, notificationId) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.INVITE_ACCEPT(workspaceId, notificationId)
  );
  return response.data?.workspace || null;
};
