import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Briefcase } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { SkeletonList } from "../../components/common/Loader";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import WorkspaceForm from "../../components/workspace/WorkspaceForm";

const Workspaces = () => {
  const {
    workspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    loading,
  } = useWorkspace();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const workspace = await createWorkspace(formData);
      setShowCreateModal(false);
      navigate(`/app/workspaces/${workspace.id}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowEditModal(true);
  };

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      await updateWorkspace(selectedWorkspace.id, formData);
      setShowEditModal(false);
      setSelectedWorkspace(null);
    } catch (error) {
      console.error("Error updating workspace:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteWorkspace(selectedWorkspace.id);
      setShowDeleteModal(false);
      setSelectedWorkspace(null);
    } catch (error) {
      console.error("Error deleting workspace:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Workspaces
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
            Manage your workspaces and collaborate with your team
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          New Workspace
        </Button>
      </div>

      {/* Workspaces Grid */}
      {loading ? (
        <SkeletonList count={6} />
      ) : workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No workspaces yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">
            Create your first workspace to get started with your projects
          </p>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Workspace
          </Button>
        </Card>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Workspace"
      >
        <WorkspaceForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Workspace Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedWorkspace(null);
        }}
        title="Edit Workspace"
      >
        <WorkspaceForm
          workspace={selectedWorkspace}
          onSubmit={handleUpdate}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedWorkspace(null);
          }}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedWorkspace(null);
        }}
        title="Delete Workspace"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
            Are you sure you want to delete{" "}
            <strong>{selectedWorkspace?.name}</strong>? This action cannot be
            undone and will delete all projects and tasks within this workspace.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedWorkspace(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={submitting}
            >
              Delete Workspace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Workspaces;
