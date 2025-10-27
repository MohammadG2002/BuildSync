import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Trash2, AlertTriangle } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

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
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
    }
    return newErrors;
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
      <div className="space-y-6">
        <Card className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
            Workspace Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage {workspace.name} settings and preferences
          </p>
        </div>
      </div>

      {/* General Settings */}
      <Card title="General Settings">
        <form onSubmit={handleSaveChanges} className="space-y-5">
          <Input
            label="Workspace Name"
            type="text"
            name="name"
            placeholder="e.g., Marketing Team"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="What is this workspace for?"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Workspace Information */}
      <Card title="Workspace Information">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Workspace ID</p>
              <p className="text-sm text-gray-500">
                Unique identifier for this workspace
              </p>
            </div>
            <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">
              {workspaceId}
            </code>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Created Date</p>
              <p className="text-sm text-gray-500">
                When this workspace was created
              </p>
            </div>
            <p className="text-sm text-gray-900">
              {workspace.createdDate
                ? new Date(workspace.createdDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Members</p>
              <p className="text-sm text-gray-500">
                Number of members in this workspace
              </p>
            </div>
            <p className="text-sm text-gray-900">
              {workspace.memberCount || 0}
            </p>
          </div>
        </div>
      </Card>

      {/* Notifications Settings */}
      <Card title="Notification Preferences">
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Task Assignments
              </p>
              <p className="text-sm text-gray-500">
                Get notified when you're assigned to a task
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Project Updates
              </p>
              <p className="text-sm text-gray-500">
                Get notified about project changes and updates
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">New Members</p>
              <p className="text-sm text-gray-500">
                Get notified when new members join the workspace
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Daily Digest</p>
              <p className="text-sm text-gray-500">
                Receive a daily summary of workspace activity
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy & Access">
        <div className="space-y-4">
          <div>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Private Workspace
                </p>
                <p className="text-sm text-gray-500">
                  Only invited members can access this workspace
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Allow Member Invites
                </p>
                <p className="text-sm text-gray-500">
                  Let members invite other people to this workspace
                </p>
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Danger Zone
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Deleting this workspace is permanent and cannot be undone. All
                projects, tasks, and data will be permanently deleted.
              </p>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                className="gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Workspace
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation("");
        }}
        title="Delete Workspace"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1">
                  This action cannot be undone
                </h4>
                <p className="text-sm text-red-700">
                  This will permanently delete the{" "}
                  <strong>{workspace.name}</strong> workspace, including all
                  projects, tasks, and member access.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-2">
              Please type <strong>{workspace.name}</strong> to confirm deletion:
            </p>
            <Input
              type="text"
              placeholder={workspace.name}
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteWorkspace}
              loading={loading}
              disabled={deleteConfirmation !== workspace.name}
            >
              Delete Workspace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
