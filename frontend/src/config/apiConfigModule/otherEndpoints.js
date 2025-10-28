/**
 * Chat Endpoints
 */
export const CHAT_ENDPOINTS = {
  CONTACTS: "/chat/contacts",
  MESSAGES: (contactId) => `/chat/messages/${contactId}`,
  SEND: "/chat/messages",
  MARK_READ: (messageId) => `/chat/messages/${messageId}/read`,
};

/**
 * Notification Endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
  LIST: "/notifications",
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: "/notifications/mark-all-read",
  DELETE: (id) => `/notifications/${id}`,
};

/**
 * File Upload Endpoints
 */
export const FILE_ENDPOINTS = {
  UPLOAD: "/files/upload",
  DELETE: (id) => `/files/${id}`,
};
