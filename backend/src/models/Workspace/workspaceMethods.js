/**
 * Workspace Model Methods
 */

export const setupWorkspaceMethods = (schema) => {
  // Check if user is member (includes owner)
  schema.methods.isMember = function (userId) {
    // Check if user is owner
    if (this.owner.toString() === userId.toString()) {
      return true;
    }
    // Check if user is in members array
    return this.members.some(
      (member) => member.user.toString() === userId.toString()
    );
  };

  // Get user role in workspace (includes owner)
  schema.methods.getUserRole = function (userId) {
    // Check if user is owner
    if (this.owner.toString() === userId.toString()) {
      return "owner";
    }
    // Check members array
    const member = this.members.find(
      (m) => m.user.toString() === userId.toString()
    );
    return member?.role || null;
  };
};
