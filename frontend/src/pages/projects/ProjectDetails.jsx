import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import * as taskService from "../../services/taskService";
import * as projectService from "../../services/projectService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import TaskList from "../../components/task/TaskList";
import TaskForm from "../../components/task/TaskForm";
import TaskDetailsModal from "../../components/task/TaskDetailsModal";
import toast from "react-hot-toast";
import {
  TaskStatCard,
  FilterButtons,
  GroupBySelector,
  EmptyTasksState,
  DeleteTaskModalContent,
  calculateTaskStats,
} from "./projectDetailsModule";
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
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    setLoading(true);
    try {
      const projectData = await projectService.getProjectById(
        workspaceId,
        projectId
      );
      setProject(projectData);

      const tasksData = await taskService.getTasks(workspaceId, projectId);
      setTasks(tasksData);

      // Fetch workspace members for assignee dropdown
      // TODO: Implement memberService.getWorkspaceMembers(workspaceId)
      setMembers([]);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to fetch project details");
      setProject(null);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    setSubmitting(true);
    try {
      const newTask = await taskService.createTask(
        workspaceId,
        projectId,
        formData
      );
      setTasks([...tasks, newTask]);
      setShowCreateModal(false);
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = async (formData) => {
    setSubmitting(true);
    try {
      const updatedTask = await taskService.updateTask(
        workspaceId,
        projectId,
        selectedTask._id,
        formData
      );
      setTasks(
        tasks.map((t) => (t._id === selectedTask._id ? updatedTask : t))
      );
      setShowEditModal(false);
      setSelectedTask(null);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const handleDeleteTask = async () => {
    setSubmitting(true);
    try {
      await taskService.deleteTask(workspaceId, projectId, selectedTask._id);
      setTasks(tasks.filter((t) => t._id !== selectedTask._id));
      setShowDeleteModal(false);
      setSelectedTask(null);
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const updatedTask = await taskService.updateTask(
        workspaceId,
        projectId,
        task._id,
        { status: newStatus }
      );
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
      toast.success(`Task marked as ${newStatus.replace(/-/g, " ")}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleTaskClick = async (task) => {
    try {
      // Fetch full task details with populated fields
      const fullTask = await taskService.getTaskById(
        workspaceId,
        projectId,
        task._id
      );
      setSelectedTask(fullTask);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
      // Fall back to showing the task we have
      setSelectedTask(task);
      setShowDetailsModal(true);
    }
  };

  const handleTaskDetailsUpdate = async (updatedTaskData) => {
    try {
      const updatedTask = await taskService.updateTask(
        workspaceId,
        projectId,
        updatedTaskData._id,
        updatedTaskData
      );
      setTasks(
        tasks.map((t) => (t._id === updatedTaskData._id ? updatedTask : t))
      );
      setSelectedTask(updatedTask);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleAddComment = async (taskId, commentContent) => {
    try {
      const updatedTask = await taskService.addComment(
        workspaceId,
        projectId,
        taskId,
        commentContent
      );
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
      setSelectedTask(updatedTask);
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  const handleDeleteAttachment = async (taskId, attachmentId) => {
    try {
      const updatedTask = await taskService.deleteAttachment(
        workspaceId,
        projectId,
        taskId,
        attachmentId
      );
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
      setSelectedTask(updatedTask);
      toast.success("Attachment deleted successfully!");
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error("Failed to delete attachment");
    }
  };

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
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
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
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
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
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteClick}
          onStatusChange={handleStatusChange}
          onTaskClick={handleTaskClick}
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
          onSubmit={handleCreateTask}
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
          onSubmit={handleUpdateTask}
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
          onConfirm={handleDeleteTask}
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
          onUpdate={handleTaskDetailsUpdate}
          onAddComment={handleAddComment}
          onDeleteAttachment={handleDeleteAttachment}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
