/**
 * Task Model Hooks/Middleware
 */

export const setupTaskHooks = (schema) => {
  // Update completedAt when status changes to completed
  schema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "completed") {
      this.completedAt = new Date();
    } else if (this.isModified("status") && this.status !== "completed") {
      this.completedAt = null;
    }
    next();
  });
};
