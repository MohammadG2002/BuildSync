/**
 * Seed Data - Workspace
 */

export const createWorkspaceData = (users) => ({
  name: "Demo Workspace",
  description: "A demo workspace for testing BuildSync",
  owner: users[0]._id,
  members: [
    { user: users[0]._id, role: "owner" },
    { user: users[1]._id, role: "admin" },
    { user: users[2]._id, role: "member" },
    { user: users[3]._id, role: "member" },
  ],
  settings: {
    visibility: "private",
    allowInvites: true,
  },
});
