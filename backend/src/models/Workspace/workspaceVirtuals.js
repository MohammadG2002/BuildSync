/**
 * Workspace Model Virtuals
 */

export const setupWorkspaceVirtuals = (schema) => {
  // Virtual for projects
  schema.virtual("projects", {
    ref: "Project",
    localField: "_id",
    foreignField: "workspace",
  });
};
