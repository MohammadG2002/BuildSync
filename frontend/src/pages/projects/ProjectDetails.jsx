import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import TaskList from "../../components/task/TaskList";
import TaskForm from "../../components/task/TaskForm";
import TaskDetailsModal from "../../components/task/TaskDetailsModal";
import {
  TaskStatCard,
  FilterButtons,
  GroupBySelector,
  EmptyTasksState,
  DeleteTaskModalContent,
  AddProjectMemberModal,
} from "../../components/projectDetails";
import { useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { calculateTaskStats } from "../../utils/project/calculateTaskStats";
import fetchProjectAndTasks from "../../utils/project/fetchProjectAndTasks";
import handleCreateTask from "../../utils/project/handleCreateTask";
import handleEditTask from "../../utils/project/handleEditTask";
import handleUpdateTask from "../../utils/project/handleUpdateTask";
import handleDeleteClick from "../../utils/project/handleDeleteClick";
import handleDeleteTask from "../../utils/project/handleDeleteTask";
import handleStatusChange from "../../utils/project/handleStatusChange";
import handleTaskClick from "../../utils/project/handleTaskClick";
import handleTaskDetailsUpdate from "../../utils/project/handleTaskDetailsUpdate";
import handleAddComment from "../../utils/project/handleAddComment";
import handleDeleteAttachment from "../../utils/project/handleDeleteAttachment";
import handleAddAttachment from "../../utils/project/handleAddAttachment";
// removed handleAddProjectMember - modal now toggles membership directly within component
import styles from "./ProjectDetails.module.css";

const ProjectDetails = () => {
  const { workspaceId, projectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'board'
  const [groupBy, setGroupBy] = useState("none"); // 'none', 'status', 'priority'

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  // removed selectedMemberId - not needed with new Members modal behavior
  const [submitting, setSubmitting] = useState(false);

  const [members, setMembers] = useState([]);

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
          onDeleteAttachment={(taskId, attachmentId) =>
            handleDeleteAttachment(
              taskId,
              attachmentId,
              workspaceId,
              projectId,
              tasks,
              setTasks,
              setSelectedTask
            )
          }
          onAddAttachment={(file) =>
            handleAddAttachment(
              file,
              workspaceId,
              projectId,
              selectedTask._id,
              tasks,
              setTasks,
              setSelectedTask
            )
          }
          readOnly={isViewer}
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
    </div>
  );
};

export default ProjectDetails;
