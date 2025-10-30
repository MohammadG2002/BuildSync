/**
 * Handle workspace delete click
 */
const handleDeleteClick = (
  workspace,
  setSelectedWorkspace,
  setShowDeleteModal
) => {
  setSelectedWorkspace(workspace);
  setShowDeleteModal(true);
};

export default handleDeleteClick;
