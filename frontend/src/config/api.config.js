// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
    UPDATE_PROFILE: "/auth/profile",
  },

  // Workspaces
  WORKSPACES: {
    LIST: "/workspaces",
    CREATE: "/workspaces",
    GET: (id) => `/workspaces/${id}`,
    UPDATE: (id) => `/workspaces/${id}`,
    DELETE: (id) => `/workspaces/${id}`,
    MEMBERS: (id) => `/members/workspace/${id}`,
    ADD_MEMBER: (id) => `/workspaces/${id}/members`,
    UPDATE_MEMBER: (workspaceId, memberId) =>
      `/members/workspace/${workspaceId}/${memberId}`,
    REMOVE_MEMBER: (workspaceId, memberId) =>
      `/workspaces/${workspaceId}/members/${memberId}`,
  },

  // Projects
  PROJECTS: {
    LIST: (workspaceId) => `/projects?workspace=${workspaceId}`,
    CREATE: (workspaceId) => `/projects`,
    GET: (workspaceId, projectId) => `/projects/${projectId}`,
    UPDATE: (workspaceId, projectId) => `/projects/${projectId}`,
    DELETE: (workspaceId, projectId) => `/projects/${projectId}`,
  },

  // Tasks
  TASKS: {
    LIST: (workspaceId, projectId) => `/tasks?project=${projectId}`,
    CREATE: (workspaceId, projectId) => `/tasks`,
    GET: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
    UPDATE: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
    DELETE: (workspaceId, projectId, taskId) => `/tasks/${taskId}`,
    ARCHIVE: (workspaceId, projectId, taskId) => `/tasks/${taskId}/archive`,
    ARCHIVED: (workspaceId) => `/tasks/archived?workspace=${workspaceId}`,
  },

  // Chat
  CHAT: {
    CONTACTS: "/chat/contacts",
    MESSAGES: (contactId) => `/chat/messages/${contactId}`,
    SEND: "/chat/messages",
    MARK_READ: (messageId) => `/chat/messages/${messageId}/read`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: (id) => `/notifications/${id}`,
  },

  // File Upload
  FILES: {
    UPLOAD: "/files/upload",
    DELETE: (id) => `/files/${id}`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  INTERNAL_SERVER_ERROR: 500,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN: "An unexpected error occurred.",
};
