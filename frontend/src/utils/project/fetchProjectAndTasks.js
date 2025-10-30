import * as projectService from "../../../services/projectService";
import * as taskService from "../../../services/taskService";
import toast from "react-hot-toast";

/**
 * Fetch project and tasks data
 */
const fetchProjectAndTasks = async (
  workspaceId,
  projectId,
  setProject,
  setTasks,
  setMembers,
  setLoading
) => {
  setLoading(true);
  try {
    const projectData = await projectService.getProjectById(
      workspaceId,
      projectId
    );
    setProject(projectData);

    const tasksData = await taskService.getTasks(workspaceId, projectId);
    setTasks(tasksData);

    // Fetch workspace members for assignee dropdown
    // TODO: Implement memberService.getWorkspaceMembers(workspaceId)
    setMembers([]);
  } catch (error) {
    console.error("Error fetching project details:", error);
    toast.error("Failed to fetch project details");
    setProject(null);
    setTasks([]);
  } finally {
    setLoading(false);
  }
};

export default fetchProjectAndTasks;
