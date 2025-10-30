import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import Button from "../../components/common/Button";
import {
  WorkspaceNotFoundState,
  GeneralSettingsForm,
  WorkspaceInfoCard,
  NotificationPreferences,
  PrivacySettings,
  DangerZone,
  DeleteWorkspaceModal,
} from "../../components/settings";
import handleChange from "../../utils/settings/handleChange";
import handleSaveChanges from "../../utils/settings/handleSaveChanges";
import handleDeleteWorkspace from "../../utils/settings/handleDeleteWorkspace";
import styles from "../../components/settings/Settings.module.css";

const Settings = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspaces, updateWorkspace, deleteWorkspace } = useWorkspace();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const ws = workspaces.find((w) => w.id === workspaceId);
    if (ws) {
      setWorkspace(ws);
      setFormData({
        name: ws.name,
        description: ws.description || "",
      });
    }
  }, [workspaceId, workspaces]);

  if (!workspace) {
    return (
      <WorkspaceNotFoundState onBackClick={() => navigate("/app/workspaces")} />
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          variant="ghost"
          onClick={() => navigate(`/app/workspaces/${workspaceId}`)}
          className={styles.backButton}
        >
          <ArrowLeft className={styles.backIcon} />
        </Button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Workspace Settings</h1>
          <p className={styles.subtitle}>
            Manage {workspace.name} settings and preferences
          </p>
        </div>
      </div>

      {/* General Settings */}
      <GeneralSettingsForm
        formData={formData}
        errors={errors}
        loading={loading}
        onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
        onSubmit={(e) =>
          handleSaveChanges(
            e,
            formData,
            setErrors,
            updateWorkspace,
            workspaceId,
            setLoading
          )
        }
      />

      {/* Workspace Information */}
      <WorkspaceInfoCard
        workspaceId={workspaceId}
        createdDate={workspace.createdDate}
        memberCount={workspace.memberCount}
      />

      {/* Notifications Settings */}
      <NotificationPreferences />

      {/* Privacy Settings */}
      <PrivacySettings />

      {/* Danger Zone */}
      <DangerZone onDeleteClick={() => setShowDeleteModal(true)} />

      {/* Delete Confirmation Modal */}
      <DeleteWorkspaceModal
        isOpen={showDeleteModal}
        workspaceName={workspace.name}
        deleteConfirmation={deleteConfirmation}
        loading={loading}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation("");
        }}
        onConfirmationChange={setDeleteConfirmation}
        onDelete={() =>
          handleDeleteWorkspace(
            deleteConfirmation,
            workspace,
            deleteWorkspace,
            workspaceId,
            setShowDeleteModal,
            navigate,
            setLoading
          )
        }
      />
    </div>
  );
};

export default Settings;
