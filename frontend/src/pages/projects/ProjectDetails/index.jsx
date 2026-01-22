import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../../../components/common/card/Card/Card";
import Modal from "../../../components/common/modal/Modal/Modal";
import TaskList from "../../../components/task/TaskList/TaskList/TaskList";
import TaskForm from "../../../components/task/TaskForm/TaskForm";
import TaskDetailsModal from "../../../components/task/TaskDetailsModal/TaskDetailsModal";
import EmptyTasksState from "../../../components/projectDetails/EmptyTasksState/EmptyTasksState";
import DeleteTaskModalContent from "../../../components/projectDetails/DeleteTaskModalContent/DeleteTaskModalContent";
import ArchiveTaskModalContent from "../../../components/projectDetails/ArchiveTaskModalContent/ArchiveTaskModalContent";
import AddProjectMemberModal from "../../../components/projectDetails/AddProjectMemberModal/AddProjectMemberModal";
import TagManagerOverlay from "../../../components/common/tag/TagManagerOverlay/TagManagerOverlay";
import ProjectHeader from "../../../components/projectDetails/ProjectHeader/ProjectHeader";
import TaskStatsGrid from "../../../components/projectDetails/TaskStatsGrid/TaskStatsGrid";
import {
  useProjectData,
  useTaskFiltering,
  useProjectPermissions,
  useProjectModals,
  useAssigneeOptions,
} from "../../../hooks/project";
import { AuthContext } from "../../../context/AuthContext";
import {
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

const ProjectDetails = () => {
  const { workspaceId, projectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data hooks
  const { project, tasks, setTasks, members, loading, refreshAll } =
    useProjectData(workspaceId, projectId);

  // UI state
  const [filterStatus, setFilterStatus] = useState("all");
  const [groupBy, setGroupBy] = useState("none");
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const {
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    showArchiveModal,
    setShowArchiveModal,
    showDetailsModal,
    setShowDetailsModal,
    showAddMemberModal,
    setShowAddMemberModal,
    showTagManager,
    setShowTagManager,
  } = useProjectModals();

  // Task filtering
  const { filteredTasks, taskStats } = useTaskFiltering(tasks, filterStatus);

  // Permissions
  const { canManageMembers, isViewer, canModerateComments } =
    useProjectPermissions(user, project, members, user?._id || user?.id);

  // Assignee options
  const { projectAssigneeOptions, getEditAssigneeOptions } = useAssigneeOptions(
    project,
    members,
    user?._id || user?.id,
  );

  // Handle tag manager global event
  useEffect(() => {
    const open = () => setShowTagManager(true);
    window.addEventListener("tags:openManager", open);
    return () => window.removeEventListener("tags:openManager", open);
  }, []);

  // Handle URL-based task opening
  useEffect(() => {
    const targetId = searchParams.get("task");
    if (!targetId || loading) return;

    const t = (tasks || []).find((x) => (x?._id || x?.id || "") === targetId);
    if (t) {
      handleTaskClick(
        t,
        workspaceId,
        projectId,
        setSelectedTask,
        setShowDetailsModal,
      );
      const next = new URLSearchParams(searchParams);
      next.delete("task");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, loading, tasks, workspaceId, projectId]);

  const currentUserId = user?._id || user?.id;

  return (
    <div className={styles.container}>
      {/* Header */}
      <ProjectHeader
        project={project}
        onBackClick={() => navigate(`/app/workspaces/${workspaceId}`)}
        onGanttClick={() =>
          navigate(`/app/workspaces/${workspaceId}/projects/${projectId}/gantt`)
        }
        onNetworkClick={() =>
          navigate(
            `/app/workspaces/${workspaceId}/projects/${projectId}/network`,
          )
        }
        onAddMemberClick={() => setShowAddMemberModal(true)}
        onCreateTaskClick={() => setShowCreateModal(true)}
        isViewer={isViewer}
      />

      {/* Task Stats */}
      <TaskStatsGrid taskStats={taskStats} />

      {/* Task List or Empty State */}
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
              setTasks,
            )
          }
          onTaskClick={(task) =>
            handleTaskClick(
              task,
              workspaceId,
              projectId,
              setSelectedTask,
              setShowDetailsModal,
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
              setSubmitting,
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
              setSubmitting,
            )
          }
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          loading={submitting}
          members={getEditAssigneeOptions(selectedTask)}
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
              setSubmitting,
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
              setSubmitting,
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
              setSelectedTask,
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
              attachmentFiles,
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
              setSelectedTask,
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
              setSelectedTask,
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
              setSelectedTask,
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
              section,
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
              section,
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
