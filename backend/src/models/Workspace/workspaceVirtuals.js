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

  // Virtual for project count
  schema.virtual("projectCount").get(function () {
    return this.projects ? this.projects.length : 0;
  });

  // Virtual for member count
  schema.virtual("memberCount").get(function () {
    return this.members ? this.members.length : 0;
  });
};
