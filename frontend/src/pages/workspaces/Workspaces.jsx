import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { SkeletonList } from "../../components/common/Loader";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import WorkspaceForm from "../../components/workspace/WorkspaceForm";
import {
  EmptyWorkspacesState,
  DeleteWorkspaceModalContent,
} from "./workspacesModule";
import styles from "./Workspaces.module.css";

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
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Workspaces</h1>
          <p className={styles.subtitle}>
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
        <div className={styles.grid}>
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
        <EmptyWorkspacesState
          onCreateWorkspace={() => setShowCreateModal(true)}
        />
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
        <DeleteWorkspaceModalContent
          workspaceName={selectedWorkspace?.name}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedWorkspace(null);
          }}
          onConfirm={handleDelete}
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default Workspaces;
