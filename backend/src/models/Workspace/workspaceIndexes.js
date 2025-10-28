/**
 * Workspace Model Indexes
 */

export const setupWorkspaceIndexes = (schema) => {
  schema.index({ owner: 1, createdAt: -1 });
  schema.index({ "members.user": 1 });
  schema.index({ name: "text", description: "text" });
};
