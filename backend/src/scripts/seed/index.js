/**
 * Database Seeder
 * Populates the database with demo data for testing
 */

import { connectDB, disconnectDB } from "../../config/database/index.js";
import { usersData } from "./usersData.js";
import { createWorkspaceData } from "./workspaceData.js";
import { createProjectsData } from "./projectsData.js";
import { createTasksData } from "./tasksData.js";
import {
  clearDatabase,
  seedUsers,
  seedWorkspace,
  seedProjects,
  seedTasks,
  displaySuccessMessage,
} from "./seederUtils/index.js";

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await clearDatabase();

    // Seed users
    const users = await seedUsers(usersData);

    // Seed workspace
    const workspaceData = createWorkspaceData(users);
    const workspace = await seedWorkspace(workspaceData);

    // Seed projects
    const projectsData = createProjectsData(workspace, users);
    const projects = await seedProjects(projectsData);

    // Seed tasks
    const tasksData = createTasksData(projects, workspace, users);
    await seedTasks(tasksData);

    // Display success message
    displaySuccessMessage();

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await disconnectDB();
    process.exit(1);
  }
};

seedData();
