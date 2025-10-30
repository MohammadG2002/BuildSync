import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
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
} from "../../components/projectDetails";
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
import styles from "./ProjectDetails.module.css";

const ProjectDetails = () => {
  const { workspaceId, projectId } = useParams();
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
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchProjectAndTasks(
      workspaceId,
      projectId,
      setProject,
      setTasks,
      setMembers,
      setLoading
    );
  }, [projectId]);

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const taskStats = calculateTaskStats(tasks);

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
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className={styles.createTaskButton}
        >
          <Plus className={styles.createTaskIcon} />
          New Task
        </Button>
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
          label="To Do"
          value={taskStats.todo}
          icon={Clock}
          color="gray"
        />
        <TaskStatCard
          label="In Progress"
          value={taskStats.inProgress}
          icon={AlertCircle}
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

      {/* Filters and View Controls */}
      <div className={styles.filtersControls}>
        <FilterButtons
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
        <GroupBySelector value={groupBy} onChange={setGroupBy} />
      </div>

      {/* Tasks List */}
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
          members={members}
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
          members={members}
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
          onAddComment={(taskId, commentContent) =>
            handleAddComment(
              taskId,
              commentContent,
              workspaceId,
              projectId,
              tasks,
              setTasks,
              setSelectedTask
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
        />
      )}
    </div>
  );
};

export default ProjectDetails;
