import toast from "react-hot-toast";

/**
 * Handle task restoration
 */
const handleRestoreTask = async (
  selectedTask,
  archivedTasks,
  setArchivedTasks,
  setShowRestoreModal,
  setSelectedTask,
  setRestoring
) => {
  setRestoring(true);
  try {
    // API call to restore task would go here
    setArchivedTasks(archivedTasks.filter((t) => t.id !== selectedTask.id));
    setShowRestoreModal(false);
    setSelectedTask(null);
    toast.success("Task restored successfully!");
  } catch (error) {
    console.error("Error restoring task:", error);
    toast.error("Failed to restore task");
  } finally {
    setRestoring(false);
  }
};

export default handleRestoreTask;
