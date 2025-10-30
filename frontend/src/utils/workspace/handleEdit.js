/**
 * Handle workspace edit click
 */
const handleEdit = (workspace, setSelectedWorkspace, setShowEditModal) => {
  setSelectedWorkspace(workspace);
  setShowEditModal(true);
};

export default handleEdit;
