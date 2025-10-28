/**
 * Message Model Indexes
 */

export const setupMessageIndexes = (schema) => {
  // Index for efficient querying
  schema.index({ workspace: 1, createdAt: -1 });
};
