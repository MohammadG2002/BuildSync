/**
 * Handle archive task click
 */
const handleArchiveClick = (task, setSelectedTask, setShowArchiveModal) => {
  setSelectedTask(task);
  setShowArchiveModal(true);
};

export default handleArchiveClick;
