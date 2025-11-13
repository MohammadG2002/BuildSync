// Unified services barrel (keeps both named and grouped access minimal without duplication)
// Named exports (direct functions/constants) for ergonomic tree-shaking
export * from "./authService";
export * from "./chatService";
export * from "./contactService";
export * from "./memberService";
export * from "./notificationService";
export * from "./projectService";
export * from "./workspaceService";
export * from "./tagService";
export * from "./taskService";
export * from "./realtime";
export * from "./shared";
export * from "./aiChatService.js";

// Infrastructure helpers
export { default as api } from "./api.js";
export { default as apiClient } from "./apiClient.js";
export * from "./websocketService.js";

// Namespaced grouped imports (optional usage pattern)
import * as authServiceNS from "./authService/index.js";
import * as chatServiceNS from "./chatService/index.js";
import * as contactServiceNS from "./contactService/index.js";
import * as memberServiceNS from "./memberService/index.js";
import * as notificationServiceNS from "./notificationService/index.js";
import * as projectServiceNS from "./projectService/index.js";
import * as tagServiceNS from "./tagService/index.js";
import * as taskServiceNS from "./taskService/index.js";
import * as workspaceServiceNS from "./workspaceService/index.js";
import * as realtimeNS from "./realtime/index.js";
import * as aiChatServiceNS from "./aiChatService.js";

export const grouped = {
  authService: authServiceNS,
  chatService: chatServiceNS,
  contactService: contactServiceNS,
  memberService: memberServiceNS,
  notificationService: notificationServiceNS,
  projectService: projectServiceNS,
  tagService: tagServiceNS,
  taskService: taskServiceNS,
  workspaceService: workspaceServiceNS,
  realtime: realtimeNS,
  aiChatService: aiChatServiceNS,
};
