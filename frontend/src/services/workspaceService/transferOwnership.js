import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const transferOwnership = async (workspaceId, newOwnerId) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.TRANSFER_OWNERSHIP(workspaceId),
    { newOwnerId }
  );
  // Expecting { success, data: { workspace } }
  return ResponseNormalizer.normalizeItem(response, "workspace");
};
