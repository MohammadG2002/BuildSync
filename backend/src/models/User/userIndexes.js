/**
 * User Model Indexes
 */

export const setupUserIndexes = (schema) => {
  // Index for faster queries
  // Note: email unique index is automatically created
  schema.index({ createdAt: -1 });
};
