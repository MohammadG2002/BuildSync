import { Briefcase, Clock, CheckCircle, Users } from "lucide-react";
import * as projectService from "../../../services/projectService";
import * as taskService from "../../../services/taskService";
import * as workspaceService from "../../../services/workspaceService";

/**
 * Fetch all dashboard data
 */
const fetchDashboardData = async (
  currentWorkspace,
  setStats,
  setProjects,
  setTasks,
  setDeadlines,
  setLoading
) => {
  setLoading(true);
  try {
    if (!currentWorkspace) return;

    // Fetch all dashboard data in parallel
    const [projectsData, tasksData, workspaceData] = await Promise.all([
      projectService.getProjects(currentWorkspace.id),
      taskService.getTasks(currentWorkspace.id),
      workspaceService.getWorkspaceMembers(currentWorkspace.id),
    ]);

    // Calculate stats from real data
    const totalProjects = projectsData.length;
    const activeTasks = tasksData.filter(
      (t) => t.status === "in_progress"
    ).length;
    const completedTasks = tasksData.filter(
      (t) => t.status === "completed"
    ).length;
    const teamMembers = workspaceData.length;

    const statsData = [
      {
        title: "Total Projects",
        value: totalProjects.toString(),
        icon: Briefcase,
        color: "blue",
        change: `${totalProjects} active`,
        trend: "neutral",
      },
      {
        title: "Active Tasks",
        value: activeTasks.toString(),
        icon: Clock,
        color: "yellow",
        change: `${activeTasks} in progress`,
        trend: "neutral",
      },
      {
        title: "Completed",
        value: completedTasks.toString(),
        icon: CheckCircle,
        color: "green",
        change: `${completedTasks} done`,
        trend: "up",
      },
      {
        title: "Team Members",
        value: teamMembers.toString(),
        icon: Users,
        color: "purple",
        change: `${teamMembers} members`,
        trend: "neutral",
      },
    ];

    setStats(statsData);
    setProjects(projectsData.slice(0, 3)); // Show recent 3 projects
    setTasks(tasksData.slice(0, 5)); // Show recent 5 tasks

    // Filter upcoming deadlines
    const upcomingDeadlines = tasksData
      .filter((t) => t.dueDate && new Date(t.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
    setDeadlines(upcomingDeadlines);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Set empty arrays on error
    setStats([]);
    setProjects([]);
    setTasks([]);
    setDeadlines([]);
  } finally {
    setLoading(false);
  }
};

export default fetchDashboardData;
