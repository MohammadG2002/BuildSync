/**
 * Handle edit task click
 */
const handleEditTask = (task, setSelectedTask, setShowEditModal) => {
  setSelectedTask(task);
  setShowEditModal(true);
};

export default handleEditTask;
