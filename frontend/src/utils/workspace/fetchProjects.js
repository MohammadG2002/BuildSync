import * as projectService from "../../services/projectService";
import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

/**
 * Fetch projects for a workspace
 */
const fetchProjects = async (workspaceId, setProjects, setLoading) => {
  setLoading(true);
  try {
    const [projectsData, tasksData] = await Promise.all([
      projectService.getProjects(workspaceId),
      taskService.getTasks(workspaceId),
    ]);

    // Helper to normalize status
    const norm = (s) => (s ? String(s).toLowerCase().replace(/_/g, "-") : "");
    const getId = (obj) => (obj ? obj.id || obj._id || obj : obj);
    const getTaskProjectId = (t) => getId(t.project) || t.projectId;

    const decorated = projectsData.map((p) => {
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

      return {
        ...p,
        progress,
        completedTasksCount: completed,
        totalExcludingBlocked: totalExclBlocked,
      };
    });

    setProjects(decorated);
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Failed to fetch projects");
    setProjects([]);
  } finally {
    setLoading(false);
  }
};

export default fetchProjects;
