import * as projectService from "../../../services/projectService";
import toast from "react-hot-toast";

/**
 * Handle project deletion
 */
const handleDeleteProject = async (
  workspaceId,
  selectedProject,
  projects,
  setProjects,
  setShowDeleteModal,
  setSelectedProject,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    await projectService.deleteProject(workspaceId, selectedProject.id);
    setProjects(projects.filter((p) => p.id !== selectedProject.id));
    setShowDeleteModal(false);
    setSelectedProject(null);
    toast.success("Project deleted successfully!");
  } catch (error) {
    console.error("Error deleting project:", error);
    toast.error("Failed to delete project");
  } finally {
    setSubmitting(false);
  }
};

export default handleDeleteProject;
