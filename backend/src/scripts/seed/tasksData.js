/**
 * Seed Data - Tasks
 */

export const createTasksData = (projects, workspace, users) => [
  {
    title: "Create wireframes for homepage",
    description: "Design wireframes for the new homepage layout",
    project: projects[0]._id,
    workspace: workspace._id,
    assignedTo: users[1]._id,
    createdBy: users[0]._id,
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ["design", "wireframe"],
  },
  {
    title: "Implement responsive navigation",
    description: "Build responsive navigation menu with mobile support",
    project: projects[0]._id,
    workspace: workspace._id,
    assignedTo: users[2]._id,
    createdBy: users[0]._id,
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    tags: ["frontend", "responsive"],
  },
  {
    title: "Setup React Native project",
    description: "Initialize React Native project with expo",
    project: projects[1]._id,
    workspace: workspace._id,
    assignedTo: users[2]._id,
    createdBy: users[1]._id,
    status: "completed",
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ["mobile", "setup"],
  },
];
