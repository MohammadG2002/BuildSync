import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import {
  WorkspaceNotFoundState,
  GeneralSettingsForm,
  WorkspaceInfoCard,
  NotificationPreferences,
  PrivacySettings,
  DangerZone,
  DeleteWorkspaceModal,
  validateWorkspaceSettings,
} from "./settingsModule";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    return validateWorkspaceSettings(formData);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await updateWorkspace(workspaceId, formData);
      toast.success("Workspace settings updated successfully!");
    } catch (error) {
      console.error("Error updating workspace:", error);
      toast.error("Failed to update workspace settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (deleteConfirmation !== workspace?.name) {
      toast.error("Please type the workspace name correctly to confirm");
      return;
    }

    setLoading(true);
    try {
      await deleteWorkspace(workspaceId);
      setShowDeleteModal(false);
      navigate("/app/workspaces");
      toast.success("Workspace deleted successfully");
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace");
    } finally {
      setLoading(false);
    }
  };

  if (!workspace) {
    return (
      <WorkspaceNotFoundState onBackClick={() => navigate("/app/workspaces")} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Workspace Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
            Manage {workspace.name} settings and preferences
          </p>
        </div>
      </div>

      {/* General Settings */}
      <GeneralSettingsForm
        formData={formData}
        errors={errors}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSaveChanges}
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
        onConfirmationChange={(e) => setDeleteConfirmation(e.target.value)}
        onDelete={handleDeleteWorkspace}
      />
    </div>
  );
};

export default Settings;
