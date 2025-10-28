/**
 * Seed Data - Projects
 */

export const createProjectsData = (workspace, users) => [
  {
    name: "Website Redesign",
    description: "Redesign company website with modern UI/UX",
    workspace: workspace._id,
    owner: users[0]._id,
    status: "active",
    priority: "high",
    startDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    members: [
      { user: users[0]._id, role: "owner" },
      { user: users[1]._id, role: "admin" },
    ],
    tags: ["design", "frontend"],
    color: "#3B82F6",
  },
  {
    name: "Mobile App Development",
    description: "Build native mobile app for iOS and Android",
    workspace: workspace._id,
    owner: users[1]._id,
    status: "planning",
    priority: "medium",
    members: [
      { user: users[1]._id, role: "owner" },
      { user: users[2]._id, role: "member" },
    ],
    tags: ["mobile", "development"],
    color: "#10B981",
  },
];
