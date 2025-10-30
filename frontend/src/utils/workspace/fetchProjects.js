import * as projectService from "../../../services/projectService";
import toast from "react-hot-toast";

/**
 * Fetch projects for a workspace
 */
const fetchProjects = async (workspaceId, setProjects, setLoading) => {
  setLoading(true);
  try {
    const data = await projectService.getProjects(workspaceId);
    setProjects(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Failed to fetch projects");
    setProjects([]);
  } finally {
    setLoading(false);
  }
};

export default fetchProjects;
