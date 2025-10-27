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
import TaskList from "../../components/task/TaskList";
import TaskForm from "../../components/task/TaskForm";
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
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Mock members for assignee dropdown
  const mockMembers = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
  ];

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    setLoading(true);
    try {
      // Mock data for development
      setProject({
        id: projectId,
        name: "Website Redesign",
        description: "Complete overhaul of company website",
        status: "active",
      });

      setTasks([
        {
          id: "1",
          title: "Design homepage mockup",
          description: "Create new homepage design in Figma",
          status: "done",
          priority: "high",
          assignee: { id: "1", name: "John Doe", avatar: null },
          assigneeId: "1",
          dueDate: "2024-11-15",
        },
        {
          id: "2",
          title: "Implement responsive navigation",
          description: "Build mobile-friendly navigation component",
          status: "in_progress",
          priority: "medium",
          assignee: { id: "2", name: "Jane Smith", avatar: null },
          assigneeId: "2",
          dueDate: "2024-11-20",
        },
        {
          id: "3",
          title: "Set up backend API",
          description: "Create REST API endpoints for content management",
          status: "todo",
          priority: "urgent",
          assignee: { id: "3", name: "Bob Johnson", avatar: null },
          assigneeId: "3",
          dueDate: "2024-11-25",
        },
        {
          id: "4",
          title: "Write unit tests",
          description: "Add test coverage for new components",
          status: "todo",
          priority: "low",
          assignee: null,
          assigneeId: "",
          dueDate: "2024-11-30",
        },
        {
          id: "5",
          title: "Code review and refactoring",
          description: "Review existing code and refactor where needed",
          status: "in_review",
          priority: "medium",
          assignee: { id: "1", name: "John Doe", avatar: null },
          assigneeId: "1",
          dueDate: "2024-11-18",
        },
      ]);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    setSubmitting(true);
    try {
      // Mock success
      const assignee = mockMembers.find((m) => m.id === formData.assigneeId);
      const newTask = {
        id: Date.now().toString(),
        ...formData,
        assignee: assignee || null,
      };
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
      const assignee = mockMembers.find((m) => m.id === formData.assigneeId);
      const updatedTask = {
        ...selectedTask,
        ...formData,
        assignee: assignee || null,
      };
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? updatedTask : t)));
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
      setTasks(tasks.filter((t) => t.id !== selectedTask.id));
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
      const updatedTask = { ...task, status: newStatus };
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      toast.success(`Task marked as ${newStatus.replace("_", " ")}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleTaskClick = (task) => {
    // Could navigate to task details or open a modal
    console.log("Task clicked:", task);
  };

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    inReview: tasks.filter((t) => t.status === "in_review").length,
    done: tasks.filter((t) => t.status === "done").length,
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
            <h1 className="text-3xl font-bold text-gray-900">
              {project?.name || "Loading..."}
            </h1>
            <p className="text-gray-600 mt-1">
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
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats.total}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">To Do</p>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats.todo}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
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
              <p className="text-sm text-gray-600 mb-1">In Review</p>
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
              <p className="text-sm text-gray-600 mb-1">Done</p>
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
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
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
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "All" : status.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Group by:</span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
          <div className="h-64 bg-gray-200 rounded"></div>
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
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-4">
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
          members={mockMembers}
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
          members={mockMembers}
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
          <p className="text-gray-600">
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
    </div>
  );
};

export default ProjectDetails;
