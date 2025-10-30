/**
 * Handle project delete click
 */
const handleDeleteProjectClick = (
  project,
  setSelectedProject,
  setShowDeleteModal
) => {
  setSelectedProject(project);
  setShowDeleteModal(true);
};

export default handleDeleteProjectClick;
