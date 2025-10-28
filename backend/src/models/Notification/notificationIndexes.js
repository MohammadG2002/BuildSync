/**
 * Notification Model Indexes
 */

export const setupNotificationIndexes = (schema) => {
  schema.index({ recipient: 1, createdAt: -1 });
  schema.index({ read: 1 });
};
