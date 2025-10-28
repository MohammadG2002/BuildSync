export { API_CONFIG } from "./config";
export { HTTP_STATUS } from "./httpStatus";
export { ERROR_MESSAGES } from "./errorMessages";
export { API_ENDPOINTS } from "./endpoints";

// Export individual endpoint groups for direct import
export { AUTH_ENDPOINTS } from "./authEndpoints";
export { WORKSPACE_ENDPOINTS } from "./workspaceEndpoints";
export { PROJECT_ENDPOINTS } from "./projectEndpoints";
export { TASK_ENDPOINTS } from "./taskEndpoints";
export {
  CHAT_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  FILE_ENDPOINTS,
} from "./otherEndpoints";
