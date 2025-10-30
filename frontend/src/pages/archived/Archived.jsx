import { useEffect, useState } from "react";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  ArchivedStats,
  ArchivedFilters,
  ArchivedTaskGroup,
  ArchivedLoadingState,
  ArchivedEmptyState,
  RestoreTaskModal,
  filterArchivedTasks,
  groupTasksByProject,
} from "../../components/archived";
import fetchData from "../../utils/archived/fetchData";
import handleRestoreClick from "../../utils/archived/handleRestoreClick";
import handleRestoreTask from "../../utils/archived/handleRestoreTask";
import styles from "./Archived.module.css";

const Archived = () => {
  const { currentWorkspace, workspaces } = useWorkspace();
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      fetchData(currentWorkspace, setArchivedTasks, setProjects, setLoading);
    }
  }, [currentWorkspace]);

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
        projects={projects}
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
              onRestoreClick={(task) =>
                handleRestoreClick(task, setSelectedTask, setShowRestoreModal)
              }
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
        onRestore={() =>
          handleRestoreTask(
            selectedTask,
            archivedTasks,
            setArchivedTasks,
            setShowRestoreModal,
            setSelectedTask,
            setRestoring
          )
        }
        restoring={restoring}
      />
    </div>
  );
};

export default Archived;
