import { AUTH_ENDPOINTS } from "./authEndpoints";
import { WORKSPACE_ENDPOINTS } from "./workspaceEndpoints";
import { PROJECT_ENDPOINTS } from "./projectEndpoints";
import { TASK_ENDPOINTS } from "./taskEndpoints";
import { TAG_ENDPOINTS } from "./tagEndpoints";
import {
  CHAT_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  FILE_ENDPOINTS,
} from "./otherEndpoints";

/**
 * Consolidated API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  WORKSPACES: WORKSPACE_ENDPOINTS,
  PROJECTS: PROJECT_ENDPOINTS,
  TASKS: TASK_ENDPOINTS,
  TAGS: TAG_ENDPOINTS,
  CHAT: CHAT_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  FILES: FILE_ENDPOINTS,
};
