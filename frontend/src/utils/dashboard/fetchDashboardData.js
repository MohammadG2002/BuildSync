import { Briefcase, ListChecks, ClipboardList, Activity } from "lucide-react";
import * as projectService from "../../services/projectService";
import * as taskService from "../../services/taskService";
import * as workspaceService from "../../services/workspaceService";

/**
 * Fetch all dashboard data
 */
const fetchDashboardData = async (
  currentWorkspace,
  setStats,
  setProjects,
  setTasks,
  setDeadlines,
  setWeeklyStatus,
  setProjectStatus,
  setLoading
) => {
  setLoading(true);
  try {
    if (!currentWorkspace) {
      // Nothing to load; ensure UI stops loading state gracefully
      setStats([]);
      setProjects([]);
      setTasks([]);
      setDeadlines([]);
      setWeeklyStatus({ labels: [], series: {} });
      setProjectStatus({ labels: [], counts: {} });
      return;
    }

    // Fetch all dashboard data in parallel
    const [projectsData, tasksData, workspaceData] = await Promise.all([
      projectService.getProjects(currentWorkspace.id),
      taskService.getTasks(currentWorkspace.id),
      workspaceService.getWorkspaceMembers(currentWorkspace.id),
    ]);

    // Calculate stats from real data (workspace-scoped)
    const totalProjects = projectsData.length;
    const totalTasks = tasksData.length;
    // Normalize status variants just in case
    const norm = (s) => (s ? String(s).toLowerCase().replace(/_/g, "-") : "");
    const todoTasks = tasksData.filter((t) => norm(t.status) === "todo").length;
    const inProgressTasks = tasksData.filter(
      (t) => norm(t.status) === "in-progress"
    ).length;

    const statsData = [
      {
        title: "Total Projects",
        value: totalProjects.toString(),
        icon: Briefcase,
        color: "blue",
        change: `${totalProjects} in workspace`,
        trend: "neutral",
      },
      {
        title: "Total Tasks",
        value: totalTasks.toString(),
        icon: ListChecks,
        color: "purple",
        change: `${totalTasks} across projects`,
        trend: "neutral",
      },
      {
        title: "To Do Tasks",
        value: todoTasks.toString(),
        icon: ClipboardList,
        color: "yellow",
        change: `${todoTasks} open`,
        trend: "neutral",
      },
      {
        title: "In Progress",
        value: inProgressTasks.toString(),
        icon: Activity,
        color: "green",
        change: `${inProgressTasks} active`,
        trend: "neutral",
      },
    ];

    // Compute per-project progress from tasks (exclude blocked from total)
    const getId = (obj) => (obj ? obj.id || obj._id || obj : obj);
    const getTaskProjectId = (t) => getId(t.project) || t.projectId;
    const decoratedProjects = projectsData.map((p) => {
      const pid = getId(p);
      const tForProject = tasksData.filter((t) => getTaskProjectId(t) == pid);
      const totalExclBlocked = tForProject.filter(
        (t) => norm(t.status) !== "blocked"
      ).length;
      const completed = tForProject.filter(
        (t) => norm(t.status) === "completed"
      ).length;
      const computedProgress = totalExclBlocked
        ? Math.round((completed / totalExclBlocked) * 100)
        : 0;
      // Prefer backend fields. If missing, fall back to our computation.
      let progress = computedProgress;
      if (typeof p.progress === "number" && !Number.isNaN(p.progress)) {
        progress = p.progress;
      } else if (
        typeof p.completedTasksCount === "number" &&
        typeof p.totalExcludingBlocked === "number" &&
        p.totalExcludingBlocked > 0
      ) {
        progress = Math.round(
          (p.completedTasksCount / p.totalExcludingBlocked) * 100
        );
      }

      return { ...p, progress };
    });

    setStats(statsData);
    setProjects(decoratedProjects.slice(0, 3)); // Show recent 3 projects with progress
    // Sort tasks by updatedAt (desc) to get most recent
    const recentTasks = [...tasksData].sort((a, b) => {
      const ad = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bd = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bd - ad;
    });
    setTasks(recentTasks.slice(0, 5)); // Show recent 5 tasks

    // Filter upcoming deadlines
    const upcomingDeadlines = tasksData
      .filter((t) => t.dueDate && new Date(t.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
    setDeadlines(upcomingDeadlines);

    // Build weekly task status changes (Sat - Fri) based on updatedAt
    const today = new Date();
    const day = today.getDay(); // 0=Sun..6=Sat
    const daysSinceSat = (day + 1) % 7; // Sun->1, Mon->2, ..., Sat->0
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - daysSinceSat);
    const labels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const dayStart = (i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    };
    const dayEnd = (i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      d.setHours(23, 59, 59, 999);
      return d;
    };

    const statuses = ["todo", "in-progress", "review", "completed", "blocked"];
    const series = {};
    statuses.forEach((s) => (series[s] = Array(7).fill(0)));

    tasksData.forEach((t) => {
      const up = t.updatedAt ? new Date(t.updatedAt) : null;
      if (!up) return;
      for (let i = 0; i < 7; i++) {
        if (up >= dayStart(i) && up <= dayEnd(i)) {
          const s = norm(t.status);
          const key = statuses.includes(s) ? s : "todo";
          series[key][i] += 1;
          break;
        }
      }
    });

    setWeeklyStatus({ labels, series });

    // Project status breakdown
    const projectStatuses = [
      "planning",
      "active",
      "on-hold",
      "completed",
      "archived",
    ];
    const projCounts = projectStatuses.reduce((acc, s) => {
      acc[s] = 0;
      return acc;
    }, {});
    projectsData.forEach((p) => {
      const ps = norm(p.status);
      const key = projectStatuses.includes(ps) ? ps : "planning";
      projCounts[key] += 1;
    });
    setProjectStatus({ labels: projectStatuses, counts: projCounts });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Set empty arrays on error
    setStats([]);
    setProjects([]);
    setTasks([]);
    setDeadlines([]);
    setWeeklyStatus({ labels: [], series: {} });
    setProjectStatus({ labels: [], counts: {} });
  } finally {
    setLoading(false);
  }
};

export default fetchDashboardData;
