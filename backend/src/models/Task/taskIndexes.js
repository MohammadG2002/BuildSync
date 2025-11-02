/**
 * Task Model Indexes
 */

export const setupTaskIndexes = (schema) => {
  schema.index({ project: 1, createdAt: -1 });
  schema.index({ workspace: 1 });
  schema.index({ assignedTo: 1 });
  schema.index({ status: 1 });
  schema.index({ dueDate: 1 });
  schema.index({ title: "text", description: "text" });
  // Unique sequence per project for tasks that have sequence assigned
  schema.index(
    { project: 1, sequence: 1 },
    { unique: true, partialFilterExpression: { sequence: { $type: "number" } } }
  );
};
