import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";
import Button from "../../../components/common/button/Button/Button";
import Card from "../../../components/common/card/Card/Card";
import Modal from "../../../components/common/modal/Modal/Modal";
import TaskList from "../../../components/task/TaskList/TaskList/TaskList";
import TaskForm from "../../../components/task/TaskForm/TaskForm";
import TaskDetailsModal from "../../../components/task/TaskDetailsModal/TaskDetailsModal";
import TaskStatCard from "../../../components/projectDetails/TaskStatCard/TaskStatCard";
import FilterButtons from "../../../components/projectDetails/FilterButtons/FilterButtons";
import GroupBySelector from "../../../components/projectDetails/GroupBySelector/GroupBySelector";
import EmptyTasksState from "../../../components/projectDetails/EmptyTasksState/EmptyTasksState";
import DeleteTaskModalContent from "../../../components/projectDetails/DeleteTaskModalContent/DeleteTaskModalContent";
import ArchiveTaskModalContent from "../../../components/projectDetails/ArchiveTaskModalContent/ArchiveTaskModalContent";
import AddProjectMemberModal from "../../../components/projectDetails/AddProjectMemberModal/AddProjectMemberModal";
import { AuthContext } from "../../../context/AuthContext";
import {
  calculateTaskStats,
  fetchProjectAndTasks,
  handleCreateTask,
  handleEditTask,
  handleUpdateTask,
  handleDeleteClick,
  handleDeleteTask,
  handleArchiveClick,
  handleArchiveTask,
  handleStatusChange,
  handleTaskClick,
  handleTaskDetailsUpdate,
  handleAddComment,
  handleDeleteAttachment,
  handleAddAttachment,
  handleUpdateComment,
  handleDeleteComment,
  handleReactToComment,
} from "../../../utils/project";
import styles from "./ProjectDetails.module.css";
import TagManagerOverlay from "../../../components/common/tag/TagManagerOverlay/TagManagerOverlay";

const ProjectDetails = () => {
  const { workspaceId, projectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'board'
  const [groupBy, setGroupBy] = useState("none"); // 'none', 'status', 'priority'

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [members, setMembers] = useState([]);
  const [showTagManager, setShowTagManager] = useState(false);

  const refreshAll = useCallback(
    () =>
      fetchProjectAndTasks(
        workspaceId,
        projectId,
        setProject,
        setTasks,
        setMembers,
        setLoading
      ),
    [workspaceId, projectId]
  );

  useEffect(() => {
    refreshAll();
  }, [projectId, refreshAll]);

  // Open Tag Manager when requested globally
  useEffect(() => {
    const open = () => setShowTagManager(true);
    window.addEventListener("tags:openManager", open);
    return () => window.removeEventListener("tags:openManager", open);
  }, []);

  // If navigated with ?task=ID, auto-open the Task Details once tasks are loaded
  useEffect(() => {
    const targetId = searchParams.get("task");
    if (!targetId) return;
    if (loading) return; // wait until tasks/project loaded

    const t = (tasks || []).find((x) => (x?._id || x?.id || "") === targetId);
    if (t) {
      handleTaskClick(
        t,
        workspaceId,
        projectId,
        setSelectedTask,
        setShowDetailsModal
      );
      // Optionally clear the param to avoid reopen on state changes
      const next = new URLSearchParams(searchParams);
      next.delete("task");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, loading, tasks, workspaceId, projectId]);

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const taskStats = calculateTaskStats(tasks);
  const currentUserId = user?._id || user?.id;
  const projectOwnerId = project?.owner?._id || project?.owner;
  const currentProjectMember = (project?.members || []).find(
    (m) => (m?.user?._id || m?.user || m?.id || m?._id) === currentUserId
  );
  const canManageMembers =
    !!currentUserId &&
    (currentUserId === projectOwnerId ||
      currentProjectMember?.role === "admin");

  // Determine workspace role for current user (used to enforce viewer read-only UI)
  const currentWorkspaceRole = useMemo(() => {
    const found = (members || []).find((m) => m.id === currentUserId);
    return found?.role || null; // owner isn't in members payload; treat as null (not viewer)
  }, [members, currentUserId]);
  const isViewer = currentWorkspaceRole === "viewer";

  // Users with workspace owner/admin should be able to moderate comments,
  // even if they don't have project admin/owner.
  const canModerateComments =
    currentWorkspaceRole === "owner" ||
    currentWorkspaceRole === "admin" ||
    canManageMembers;

  // Assignee options: only project members by default
  const projectMemberIds = useMemo(
    () =>
      new Set(
        (project?.members || []).map(
          (m) => m?.user?._id || m?.user || m?.id || m?._id
        )
      ),
    [project]
  );

  const workspaceMembersById = useMemo(() => {
    const map = new Map();
    (members || []).forEach((m) => {
      if (m?.id) map.set(m.id, m);
    });
    return map;
  }, [members]);

  const projectAssigneeOptions = useMemo(() => {
    return Array.from(projectMemberIds)
      .map((id) => workspaceMembersById.get(id))
      .filter(Boolean);
  }, [projectMemberIds, workspaceMembersById]);

  const editAssigneeOptions = useMemo(() => {
    if (!selectedTask) return projectAssigneeOptions;
    const map = new Map(projectAssigneeOptions.map((m) => [m.id, m]));
    const assigned = Array.isArray(selectedTask?.assignedTo)
      ? selectedTask.assignedTo
      : [];
    assigned.forEach((a) => {
      const id = a?._id || a?.id || a;
      if (!id) return;
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: a?.name || "Unknown User",
          email: a?.email || "",
        });
      }
    });
    return Array.from(map.values());
  }, [projectAssigneeOptions, selectedTask]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/workspaces/${workspaceId}`)}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.backIcon} />
          </Button>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{project?.name || "Loading..."}</h1>
            <p className={styles.subtitle}>
              {project?.description || "Project details"}
            </p>
          </div>
        </div>
        <div className={styles.headerButtons}>
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/app/workspaces/${workspaceId}/projects/${projectId}/gantt`
              )
            }
            className={styles.createTaskButton}
          >
            Gantt Chart
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/app/workspaces/${workspaceId}/projects/${projectId}/network`
              )
            }
            className={styles.createTaskButton}
          >
            Network Diagram
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowAddMemberModal(true)}
            className={styles.addMemberButton}
          >
            <Users className={styles.addMemberIcon} />
            Members
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className={styles.createTaskButton}
            disabled={isViewer}
            title={isViewer ? "Viewers cannot create tasks" : undefined}
          >
            <Plus className={styles.createTaskIcon} />
            New Task
          </Button>
        </div>
      </div>

      {/* Task Stats */}
      <div className={styles.statsGrid}>
        <TaskStatCard
          label="Total"
          value={taskStats.total}
          icon={CheckCircle}
          color="gray"
        />
        <TaskStatCard
          label="In Progress"
          value={taskStats.inProgress}
          icon={Clock}
          color="blue"
        />
        <TaskStatCard
          label="In Review"
          value={taskStats.inReview}
          icon={AlertCircle}
          color="yellow"
        />
        <TaskStatCard
          label="Done"
          value={taskStats.done}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {loading ? (
        <Card className={styles.loadingCard}>
          <div className={styles.loadingCardInner}></div>
        </Card>
      ) : filteredTasks.length > 0 ? (
        <TaskList
          tasks={filteredTasks}
          onEditTask={(task) =>
            handleEditTask(task, setSelectedTask, setShowEditModal)
          }
          onDeleteTask={(task) =>
            handleDeleteClick(task, setSelectedTask, setShowDeleteModal)
          }
          onArchiveTask={(task) =>
            handleArchiveClick(task, setSelectedTask, setShowArchiveModal)
          }
          onStatusChange={(task, newStatus) =>
            handleStatusChange(
              task,
              newStatus,
              workspaceId,
              projectId,
              tasks,
              setTasks
            )
          }
          onTaskClick={(task) =>
            handleTaskClick(
              task,
              workspaceId,
              projectId,
              setSelectedTask,
              setShowDetailsModal
            )
          }
          groupBy={groupBy}
          readOnly={isViewer}
        />
      ) : (
        <EmptyTasksState
          filterStatus={filterStatus}
          onCreateTask={() => setShowCreateModal(true)}
        />
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={(formData) =>
            handleCreateTask(
              formData,
              workspaceId,
              projectId,
              tasks,
              setTasks,
              setShowCreateModal,
              setSubmitting
            )
          }
          onCancel={() => setShowCreateModal(false)}
          loading={submitting}
          members={projectAssigneeOptions}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
      >
        <TaskForm
          task={selectedTask}
          onSubmit={(formData) =>
            handleUpdateTask(
              formData,
              workspaceId,
              projectId,
              selectedTask,
              tasks,
              setTasks,
              setShowEditModal,
              setSelectedTask,
              setSubmitting
            )
          }
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          loading={submitting}
          members={editAssigneeOptions}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTask(null);
        }}
        title="Delete Task"
        size="sm"
      >
        <DeleteTaskModalContent
          taskTitle={selectedTask?.title}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedTask(null);
          }}
          onConfirm={() =>
            handleDeleteTask(
              workspaceId,
              projectId,
              selectedTask,
              tasks,
              setTasks,
              setShowDeleteModal,
              setSelectedTask,
              setSubmitting
            )
          }
          loading={submitting}
        />
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setSelectedTask(null);
        }}
        title="Archive Task"
        size="sm"
      >
        <ArchiveTaskModalContent
          taskTitle={selectedTask?.title}
          onCancel={() => {
            setShowArchiveModal(false);
            setSelectedTask(null);
          }}
          onConfirm={() =>
            handleArchiveTask(
              workspaceId,
              projectId,
              selectedTask,
              tasks,
              setTasks,
              setShowArchiveModal,
              setSelectedTask,
              setSubmitting
            )
          }
          loading={submitting}
        />
      </Modal>

      {/* Task Details Modal */}
      {showDetailsModal && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTask(null);
          }}
          onUpdate={(updatedTaskData) =>
            handleTaskDetailsUpdate(
              updatedTaskData,
              workspaceId,
              projectId,
              tasks,
              setTasks,
              setSelectedTask
            )
          }
          onAddComment={(taskId, commentContent, attachmentFiles) =>
            handleAddComment(
              taskId,
              commentContent,
              workspaceId,
              projectId,
              tasks,
              setTasks,
              setSelectedTask,
              attachmentFiles
            )
          }
          onUpdateComment={(taskId, commentId, content) =>
            handleUpdateComment(
              workspaceId,
              projectId,
              taskId,
              commentId,
              content,
              tasks,
              setTasks,
              setSelectedTask
            )
          }
          onDeleteComment={(taskId, commentId) =>
            handleDeleteComment(
              workspaceId,
              projectId,
              taskId,
              commentId,
              tasks,
              setTasks,
              setSelectedTask
            )
          }
          onReactComment={(taskId, commentId, action) =>
            handleReactToComment(
              workspaceId,
              projectId,
              taskId,
              commentId,
              action,
              tasks,
              setTasks,
              setSelectedTask
            )
          }
          onDeleteAttachment={(taskId, attachmentId, section) =>
            handleDeleteAttachment(
              taskId,
              attachmentId,
              workspaceId,
              projectId,
              tasks,
              setTasks,
              setSelectedTask,
              section
            )
          }
          onAddAttachment={(file, section) =>
            handleAddAttachment(
              file,
              workspaceId,
              projectId,
              selectedTask._id,
              tasks,
              setTasks,
              setSelectedTask,
              section
            )
          }
          readOnly={isViewer}
          currentUserId={currentUserId}
          canModerateComments={canModerateComments}
        />
      )}

      {/* Project Members Modal */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Project Members"
        size="md"
      >
        <AddProjectMemberModal
          workspaceMembers={members}
          project={project}
          workspaceId={workspaceId}
          projectId={projectId}
          canEdit={canManageMembers}
          onCancel={() => setShowAddMemberModal(false)}
          onRefresh={refreshAll}
        />
      </Modal>

      {/* Tag Manager Overlay */}
      <TagManagerOverlay
        isOpen={showTagManager}
        onClose={() => setShowTagManager(false)}
        onChanged={() => {
          /* optional hook for extra refresh */
        }}
      />
    </div>
  );
};

export default ProjectDetails;
