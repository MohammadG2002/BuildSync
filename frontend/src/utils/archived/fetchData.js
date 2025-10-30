import * as taskService from "../../../services/taskService";
import * as projectService from "../../../services/projectService";
import toast from "react-hot-toast";

/**
 * Fetch archived tasks and projects data
 */
const fetchData = async (
  currentWorkspace,
  setArchivedTasks,
  setProjects,
  setLoading
) => {
  setLoading(true);
  try {
    if (currentWorkspace) {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getArchivedTasks(currentWorkspace.id),
        projectService.getProjectsByWorkspace(currentWorkspace.id),
      ]);
      setArchivedTasks(tasksData);
      setProjects(projectsData);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Failed to load archived tasks");
  } finally {
    setLoading(false);
  }
};

export default fetchData;
