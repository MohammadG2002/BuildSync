/**
 * Handle restore task click
 */
const handleRestoreClick = (task, setSelectedTask, setShowRestoreModal) => {
  setSelectedTask(task);
  setShowRestoreModal(true);
};

export default handleRestoreClick;
