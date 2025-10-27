import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import * as taskService from "../../services/taskService";
import * as projectService from "../../services/projectService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { SkeletonStats, SkeletonList } from "../../components/common/Loader";
import TaskList from "../../components/task/TaskList";
import TaskForm from "../../components/task/TaskForm";
import TaskDetailsModal from "../../components/task/TaskDetailsModal";
import toast from "react-hot-toast";

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

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    inReview: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/workspaces/${workspaceId}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {project?.name || "Loading..."}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {taskStats.total}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
                To Do
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {taskStats.todo}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
                In Progress
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {taskStats.inProgress}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
                In Review
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {taskStats.inReview}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
                Done
              </p>
              <p className="text-2xl font-bold text-green-600">
                {taskStats.done}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Filters and View Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status:
            </span>
          </div>
          <div className="flex gap-2">
            {["all", "todo", "in_progress", "in_review", "done"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-700"
                  }`}
                >
                  {status === "all" ? "All" : status.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Group by:
          </span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="none">None</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <Card className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
        <Card className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">
            {filterStatus === "all"
              ? "Create your first task to get started"
              : `No tasks with status: ${filterStatus.replace("_", " ")}`}
          </p>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </Button>
        </Card>
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
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
            Are you sure you want to delete{" "}
            <strong>{selectedTask?.title}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedTask(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteTask}
              loading={submitting}
            >
              Delete Task
            </Button>
          </div>
        </div>
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
