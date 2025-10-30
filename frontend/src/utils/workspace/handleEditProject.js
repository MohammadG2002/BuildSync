/**
 * Handle project edit click
 */
const handleEditProject = (project, setSelectedProject, setShowEditModal) => {
  setSelectedProject(project);
  setShowEditModal(true);
};

export default handleEditProject;
