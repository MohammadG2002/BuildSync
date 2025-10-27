import { useEffect, useState } from "react";
import {
  Archive,
  Search,
  FolderKanban,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import * as taskService from "../../services/taskService";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { getInitials, generateColor, formatDate } from "../../utils/helpers";
import toast from "react-hot-toast";

const Archived = () => {
  const { currentWorkspace, workspaces } = useWorkspace();
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Mock projects for filter
  const mockProjects = [
    { id: "1", name: "Website Redesign" },
    { id: "2", name: "Mobile App Development" },
    { id: "3", name: "Marketing Campaign" },
  ];

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
      // Mock data for development
      setArchivedTasks([
        {
          id: "1",
          title: "Old homepage design",
          description: "Previous version of homepage design",
          projectId: "1",
          projectName: "Website Redesign",
          status: "done",
          priority: "low",
          assignee: { id: "1", name: "John Doe" },
          archivedDate: "2024-10-15T14:30:00",
          completedDate: "2024-10-10T10:00:00",
        },
        {
          id: "2",
          title: "Legacy API endpoints",
          description: "Deprecated API endpoints to be removed",
          projectId: "2",
          projectName: "Mobile App Development",
          status: "done",
          priority: "medium",
          assignee: { id: "2", name: "Jane Smith" },
          archivedDate: "2024-10-20T09:15:00",
          completedDate: "2024-10-18T16:30:00",
        },
        {
          id: "3",
          title: "Q3 marketing analysis",
          description: "Analysis of Q3 marketing performance",
          projectId: "3",
          projectName: "Marketing Campaign",
          status: "done",
          priority: "high",
          assignee: { id: "3", name: "Bob Johnson" },
          archivedDate: "2024-09-30T18:00:00",
          completedDate: "2024-09-28T14:00:00",
        },
        {
          id: "4",
          title: "Canceled feature implementation",
          description: "Feature that was canceled during development",
          projectId: "1",
          projectName: "Website Redesign",
          status: "todo",
          priority: "medium",
          assignee: null,
          archivedDate: "2024-10-25T11:00:00",
          completedDate: null,
        },
      ]);
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

  const filteredTasks = archivedTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject =
      filterProject === "all" || task.projectId === filterProject;

    return matchesSearch && matchesProject;
  });

  // Group tasks by project
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const projectName = task.projectName;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(task);
    return acc;
  }, {});

  const priorityColors = {
    low: "text-gray-600",
    medium: "text-blue-600",
    high: "text-orange-600",
    urgent: "text-red-600",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    in_review: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Archived Tasks</h1>
        <p className="text-gray-600 mt-1">
          View and restore archived tasks from all projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Archived</p>
              <p className="text-3xl font-bold text-gray-900">
                {archivedTasks.length}
              </p>
            </div>
            <Archive className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {archivedTasks.filter((t) => t.status === "done").length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Archive className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Canceled</p>
              <p className="text-3xl font-bold text-gray-600">
                {archivedTasks.filter((t) => t.status !== "done").length}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Archive className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search archived tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Project:</span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="all">All Projects</option>
            {mockProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Archived Tasks */}
      {loading ? (
        <Card className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </Card>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([projectName, tasks]) => (
            <div key={projectName}>
              <div className="flex items-center gap-2 mb-4">
                <FolderKanban className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {projectName} ({tasks.length})
                </h2>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              statusColors[task.status]
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-gray-600 mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          {task.assignee && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                style={{
                                  backgroundColor: generateColor(
                                    task.assignee.name
                                  ),
                                }}
                              >
                                {getInitials(task.assignee.name)}
                              </div>
                              <span>{task.assignee.name}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Archive className="w-4 h-4" />
                            <span>
                              Archived {formatDate(task.archivedDate)}
                            </span>
                          </div>

                          {task.completedDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Completed {formatDate(task.completedDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreClick(task)}
                        className="gap-2 ml-4"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery || filterProject !== "all"
              ? "No archived tasks found"
              : "No archived tasks yet"}
          </h3>
          <p className="text-gray-600">
            {searchQuery || filterProject !== "all"
              ? "Try adjusting your filters"
              : "Archived tasks will appear here"}
          </p>
        </Card>
      )}

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
          setSelectedTask(null);
        }}
        title="Restore Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to restore{" "}
            <strong>{selectedTask?.title}</strong>? This will move the task back
            to its original project.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRestoreModal(false);
                setSelectedTask(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRestoreTask}
              loading={restoring}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restore Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Archived;
