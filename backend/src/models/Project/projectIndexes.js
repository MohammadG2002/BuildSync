/**
 * Project Model Indexes
 */

export const setupProjectIndexes = (schema) => {
  schema.index({ workspace: 1, createdAt: -1 });
  schema.index({ owner: 1 });
  schema.index({ status: 1 });
  schema.index({ "members.user": 1 });
  schema.index({ name: "text", description: "text" });
};
