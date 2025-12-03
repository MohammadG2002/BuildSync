import { useEffect, useState, useContext } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import { getWorkspaceMembers } from "../../services/workspaceService";
import Button from "../../components/common/button/Button";
import Card from "../../components/common/card/Card";
import Modal from "../../components/common/modal/Modal";
import { ProjectCard } from "../../components/dashboard";
import ProjectForm from "../../components/project/ProjectForm";
import {
  WorkspaceStatCard,
  EmptyProjectsState,
  DeleteProjectModalContent,
} from "../../components/workspaceDetails";
import fetchProjects from "../../utils/workspace/fetchProjects";
import handleCreateProject from "../../utils/workspace/handleCreateProject";
import handleEditProject from "../../utils/workspace/handleEditProject";
import handleUpdateProject from "../../utils/workspace/handleUpdateProject";
import handleDeleteProjectClick from "../../utils/workspace/handleDeleteProjectClick";
import handleDeleteProject from "../../utils/workspace/handleDeleteProject";
import handleProjectClick from "../../utils/workspace/handleProjectClick";
import styles from "./WorkspaceDetails.module.css";
import dashboardStyles from "../../components/dashboard/Dashboard.module.css";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();
  const { user } = useContext(AuthContext);

  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [wsMembers, setWsMembers] = useState([]);

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
    fetchProjects(workspaceId, setProjects, setLoading);
    // fetch workspace members to determine permissions
    (async () => {
      try {
        const m = await getWorkspaceMembers(workspaceId);
        setWsMembers(m);
      } catch {
        setWsMembers([]);
      }
    })();
  }, [workspaceId, workspaces]);
  const currentUserId = user?._id || user?.id;
  const currentMember = wsMembers.find((m) => m.id === currentUserId);
  const canCreateProject =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  if (!workspace && !loading) {
    return (
      <div className={styles.container}>
        <Card className={styles.notFoundCard}>
          <h3 className={styles.notFoundTitle}>Workspace not found</h3>
          <Button variant="primary" onClick={() => navigate("/app/workspaces")}>
            Back to Workspaces
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            onClick={() => navigate("/app/workspaces")}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.backIcon} />
          </Button>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{workspace?.name || "Loading..."}</h1>
            <p className={styles.subtitle}>
              {workspace?.description || "Manage projects and team"}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            onClick={() => navigate(`/app/workspaces/${workspaceId}/members`)}
            className={styles.membersButton}
          >
            <Users className={styles.membersIcon} />
            Members
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/app/workspaces/${workspaceId}/settings`)}
            className={styles.settingsButton}
          >
            <SettingsIcon className={styles.settingsIcon} />
            Settings
          </Button>
        </div>
      </div>

      {/* Workspace Stats */}
      <div className={styles.statsGrid}>
        <WorkspaceStatCard
          label="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          color="blue"
        />
        <WorkspaceStatCard
          label="Active Projects"
          value={projects.filter((p) => p.status === "active").length}
          icon={Briefcase}
          color="green"
        />
        <WorkspaceStatCard
          label="Team Members"
          value={workspace?.memberCount || 0}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Projects Section */}
      <div className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
          <h2 className={styles.projectsTitle}>Projects</h2>
          {canCreateProject && (
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className={styles.newProjectButton}
            >
              <Plus className={styles.newProjectIcon} />
              New Project
            </Button>
          )}
        </div>

        {loading ? (
          <div className={dashboardStyles.projectsContainer}>
            {[1, 2, 3].map((i) => (
              <Card key={i} className={styles.loadingCard}>
                <div className={styles.loadingCardInner}></div>
              </Card>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className={dashboardStyles.projectsContainer}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id || project._id}
                project={project}
                onClick={() =>
                  handleProjectClick(project, workspaceId, navigate)
                }
                onSettings={() => {
                  setSelectedProject(project);
                  setShowEditModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyProjectsState
            canCreate={canCreateProject}
            onCreateProject={() => setShowCreateModal(true)}
          />
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <ProjectForm
          onSubmit={(formData) =>
            handleCreateProject(
              formData,
              workspaceId,
              projects,
              setProjects,
              setShowCreateModal,
              setSubmitting
            )
          }
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
          onSubmit={(formData) =>
            handleUpdateProject(
              formData,
              workspaceId,
              selectedProject,
              projects,
              setProjects,
              setShowEditModal,
              setSelectedProject,
              setSubmitting
            )
          }
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
        <DeleteProjectModalContent
          projectName={selectedProject?.name}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
          }}
          onConfirm={() =>
            handleDeleteProject(
              workspaceId,
              selectedProject,
              projects,
              setProjects,
              setShowDeleteModal,
              setSelectedProject,
              setSubmitting
            )
          }
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default WorkspaceDetails;
