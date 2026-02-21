import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import Button from "../../components/common/button/Button/Button";
import Modal from "../../components/common/modal/Modal/Modal";
import WorkspaceNotFoundState from "../../components/settings/WorkspaceNotFoundState/WorkspaceNotFoundState";
import GeneralSettingsForm from "../../components/settings/GeneralSettingsForm/GeneralSettingsForm";
import WorkspaceInfoCard from "../../components/settings/WorkspaceInfoCard/WorkspaceInfoCard";
import NotificationPreferences from "../../components/settings/NotificationPreferences/NotificationPreferences";
import PrivacySettings from "../../components/settings/PrivacySettings/PrivacySettings";
import DangerZone from "../../components/settings/DangerZone/DangerZone";
import DeleteWorkspaceModal from "../../components/settings/DeleteWorkspaceModal/DeleteWorkspaceModal";
import handleChange from "../../utils/settings/handleChange";
import handleSaveChanges from "../../utils/settings/handleSaveChanges";
import handleDeleteWorkspace from "../../utils/settings/handleDeleteWorkspace";
import styles from "./Settings.module.css";
import * as workspaceService from "../../services/workspaceService";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Settings = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspaces, updateWorkspace, deleteWorkspace, fetchWorkspaces } =
    useWorkspace();
  const { user } = useContext(AuthContext);

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaving, setLeaving] = useState(false);

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

  // Determine if current user is the workspace owner (id may be nested or raw)
  const ownerId =
    workspace?.owner?._id || workspace?.owner?.id || workspace?.owner;
  const currentUserId = user?._id || user?.id;
  const isOwner =
    ownerId && currentUserId && String(ownerId) === String(currentUserId);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContainer}>
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
        <Button
          variant="danger"
          className={styles.leaveWorkspace}
          onClick={() => setShowLeaveModal(true)}
          disabled={isOwner}
          title={
            isOwner
              ? "Owners cannot leave. Transfer ownership first via Members."
              : undefined
          }
        >
          Leave Workspace
        </Button>
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
        createdDate={workspace.createdAt}
        memberCount={workspace.memberCount}
      />

      {/* Notifications Settings */}
      <NotificationPreferences />

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

      {/* Leave Workspace Confirmation Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Leave Workspace"
        size="sm"
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <p>
            Are you sure you want to leave "{workspace.name}"? You will lose
            access to its projects until you’re invited again.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            <Button variant="outline" onClick={() => setShowLeaveModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={leaving}
              onClick={async () => {
                try {
                  setLeaving(true);
                  // Prevent owners from leaving directly
                  if (isOwner) {
                    toast.error(
                      "You are the workspace owner. Transfer ownership first via the Members page."
                    );
                    return;
                  }

                  // Remove self from workspace membership
                  await workspaceService.removeMember(
                    workspaceId,
                    currentUserId
                  );

                  toast.success(
                    `You left ${workspace?.name || "the workspace"}`
                  );
                  setShowLeaveModal(false);

                  // Refresh workspace list and navigate out
                  if (typeof fetchWorkspaces === "function") {
                    await fetchWorkspaces();
                  }
                  navigate("/app/workspaces");
                } catch (err) {
                  const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to leave workspace";
                  toast.error(msg);
                } finally {
                  setLeaving(false);
                }
              }}
            >
              Confirm Leave
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
