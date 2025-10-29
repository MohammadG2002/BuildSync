import { useEffect, useState } from "react";
import { useWorkspace } from "../../hooks/useWorkspace";
import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";
import {
  ArchivedStats,
  ArchivedFilters,
  ArchivedTaskGroup,
  ArchivedLoadingState,
  ArchivedEmptyState,
  RestoreTaskModal,
  filterArchivedTasks,
  groupTasksByProject,
  mockProjects,
} from "./archivedModule";
import styles from "./Archived.module.css";

const Archived = () => {
  const { currentWorkspace, workspaces } = useWorkspace();
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      fetchArchivedTasks();
    }
  }, [currentWorkspace]);

  const fetchArchivedTasks = async () => {
    setLoading(true);
    try {
      if (currentWorkspace) {
        const data = await taskService.getArchivedTasks(currentWorkspace.id);
        setArchivedTasks(data);
      }
    } catch (error) {
      console.error("Error fetching archived tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreClick = (task) => {
    setSelectedTask(task);
    setShowRestoreModal(true);
  };

  const handleRestoreTask = async () => {
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

  const filteredTasks = filterArchivedTasks(
    archivedTasks,
    searchQuery,
    filterProject
  );
  const groupedTasks = groupTasksByProject(filteredTasks);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div>
            <h1 className={styles.title}>Archived Tasks</h1>
            <p className={styles.subtitle}>
              View and restore archived tasks from all projects
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ArchivedStats archivedTasks={archivedTasks} />

      {/* Filters */}
      <ArchivedFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterProject={filterProject}
        onFilterChange={setFilterProject}
        projects={mockProjects}
      />

      {/* Archived Tasks */}
      {loading ? (
        <ArchivedLoadingState />
      ) : filteredTasks.length > 0 ? (
        <div className={styles.taskGroups}>
          {Object.entries(groupedTasks).map(([projectName, tasks]) => (
            <ArchivedTaskGroup
              key={projectName}
              projectName={projectName}
              tasks={tasks}
              onRestoreClick={handleRestoreClick}
            />
          ))}
        </div>
      ) : (
        <ArchivedEmptyState
          searchQuery={searchQuery}
          filterProject={filterProject}
        />
      )}

      {/* Restore Confirmation Modal */}
      <RestoreTaskModal
        isOpen={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
          setSelectedTask(null);
        }}
        selectedTask={selectedTask}
        onRestore={handleRestoreTask}
        restoring={restoring}
      />
    </div>
  );
};

export default Archived;
