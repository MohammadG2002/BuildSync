/**
 * Handle delete task click
 */
const handleDeleteClick = (task, setSelectedTask, setShowDeleteModal) => {
  setSelectedTask(task);
  setShowDeleteModal(true);
};

export default handleDeleteClick;
