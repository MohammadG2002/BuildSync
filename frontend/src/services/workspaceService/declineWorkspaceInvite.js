import apiClient, { API_ENDPOINTS } from "../apiClient";

export const declineWorkspaceInvite = async (workspaceId, notificationId) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.INVITE_DECLINE(workspaceId, notificationId)
  );
  return response.data || { success: true };
};
