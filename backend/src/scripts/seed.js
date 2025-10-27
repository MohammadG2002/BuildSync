import { connectDB, disconnectDB } from "../config/database.js";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log("Creating demo users...");
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@buildsync.com",
        password: "password123",
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: "password123",
      },
    ]);

    console.log("Creating demo workspace...");
    const workspace = await Workspace.create({
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

    console.log("Creating demo projects...");
    const projects = await Project.create([
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
    ]);

    console.log("Creating demo tasks...");
    await Task.create([
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
    ]);

    console.log("✅ Database seeded successfully!");
    console.log("\nDemo Users:");
    console.log("- admin@buildsync.com / password123 (Admin)");
    console.log("- john@example.com / password123");
    console.log("- jane@example.com / password123");
    console.log("- mike@example.com / password123");

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await disconnectDB();
    process.exit(1);
  }
};

seedData();
