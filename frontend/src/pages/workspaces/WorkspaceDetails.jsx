import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Briefcase,
  Users,
  Settings as SettingsIcon,
  ArrowLeft,
  FolderKanban,
} from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import * as projectService from "../../services/projectService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import ProjectCard from "../../components/project/ProjectCard";
import ProjectForm from "../../components/project/ProjectForm";
import toast from "react-hot-toast";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();

  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Find workspace from context
    const ws = workspaces.find((w) => w.id === workspaceId);
    if (ws) {
      setWorkspace(ws);
      // Set as current workspace if not already
      if (currentWorkspace?.id !== ws.id) {
        switchWorkspace(ws);
      }
    }
    fetchProjects();
  }, [workspaceId, workspaces]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(workspaceId);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Mock data for development
      setProjects([
        {
          id: "1",
          name: "Website Redesign",
          description: "Complete overhaul of company website",
          status: "active",
          totalTasks: 24,
          completedTasks: 12,
          memberCount: 5,
        },
        {
          id: "2",
          name: "Mobile App Development",
          description: "Build iOS and Android applications",
          status: "in_progress",
          totalTasks: 45,
          completedTasks: 15,
          memberCount: 8,
        },
        {
          id: "3",
          name: "Marketing Campaign",
          description: "Q4 marketing campaign planning and execution",
          status: "active",
          totalTasks: 18,
          completedTasks: 18,
          memberCount: 3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (formData) => {
    setSubmitting(true);
    try {
      const newProject = await projectService.createProject(
        workspaceId,
        formData
      );
      setProjects([...projects, newProject]);
      setShowCreateModal(false);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      // Mock success for development
      const mockProject = {
        id: Date.now().toString(),
        ...formData,
        totalTasks: 0,
        completedTasks: 0,
        memberCount: 1,
      };
      setProjects([...projects, mockProject]);
      setShowCreateModal(false);
      toast.success("Project created successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = async (formData) => {
    setSubmitting(true);
    try {
      const updated = await projectService.updateProject(
        workspaceId,
        selectedProject.id,
        formData
      );
      setProjects(
        projects.map((p) => (p.id === selectedProject.id ? updated : p))
      );
      setShowEditModal(false);
      setSelectedProject(null);
      toast.success("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project:", error);
      // Mock success for development
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id ? { ...p, ...formData } : p
        )
      );
      setShowEditModal(false);
      setSelectedProject(null);
      toast.success("Project updated successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleDeleteProject = async () => {
    setSubmitting(true);
    try {
      await projectService.deleteProject(workspaceId, selectedProject.id);
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
      setShowDeleteModal(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      // Mock success for development
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
      setShowDeleteModal(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectClick = (project) => {
    // Navigate to project details (we'll create this page next)
    navigate(`/app/workspaces/${workspaceId}/projects/${project.id}`);
  };

  if (!workspace && !loading) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Workspace not found
          </h3>
          <Button variant="primary" onClick={() => navigate("/app/workspaces")}>
            Back to Workspaces
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/workspaces")}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {workspace?.name || "Loading..."}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
              {workspace?.description || "Manage projects and team"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/app/workspaces/${workspaceId}/members`)}
            className="gap-2"
          >
            <Users className="w-5 h-5" />
            Members
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/app/workspaces/${workspaceId}/settings`)}
            className="gap-2"
          >
            <SettingsIcon className="w-5 h-5" />
            Settings
          </Button>
        </div>
      </div>

      {/* Workspace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {projects.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {projects.filter((p) => p.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">Team Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {workspace?.memberCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteClick}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">
              Create your first project to start managing tasks
            </p>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </Button>
          </Card>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        title="Edit Project"
      >
        <ProjectForm
          project={selectedProject}
          onSubmit={handleUpdateProject}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
        title="Delete Project"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
            Are you sure you want to delete{" "}
            <strong>{selectedProject?.name}</strong>? This action cannot be
            undone and will delete all tasks within this project.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProject(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteProject}
              loading={submitting}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkspaceDetails;
