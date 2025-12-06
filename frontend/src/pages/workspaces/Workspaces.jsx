import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";
import Button from "../../components/common/button/Button/Button";
import Modal from "../../components/common/modal/Modal/Modal";
import SkeletonList from "../../components/common/loader/SkeletonList/SkeletonList";
import WorkspaceCard from "../../components/workspace/WorkspaceCard/WorkspaceCard/WorkspaceCard";
import WorkspaceForm from "../../components/workspace/WorkspaceForm/WorkspaceForm/WorkspaceForm";
import EmptyWorkspacesState from "../../components/workspaces/EmptyWorkspacesState/EmptyWorkspacesState";
import DeleteWorkspaceModalContent from "../../components/workspaces/DeleteWorkspaceModalContent/DeleteWorkspaceModalContent";
import handleCreate from "../../utils/workspace/handleCreate";
import handleEdit from "../../utils/workspace/handleEdit";
import handleUpdate from "../../utils/workspace/handleUpdate";
import handleDeleteClick from "../../utils/workspace/handleDeleteClick";
import handleDelete from "../../utils/workspace/handleDelete";
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
          className={styles.createButton}
        >
          <Plus className={styles.createIcon} />
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
              onClick={() => navigate(`/app/workspaces/${workspace.id}`)}
              onEdit={(ws) =>
                handleEdit(ws, setSelectedWorkspace, setShowEditModal)
              }
              onDelete={(ws) =>
                handleDeleteClick(ws, setSelectedWorkspace, setShowDeleteModal)
              }
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
          onSubmit={(formData) =>
            handleCreate(
              formData,
              createWorkspace,
              setShowCreateModal,
              setSubmitting,
              navigate
            )
          }
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
          onSubmit={(formData) =>
            handleUpdate(
              formData,
              selectedWorkspace,
              updateWorkspace,
              setShowEditModal,
              setSelectedWorkspace,
              setSubmitting
            )
          }
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
          onConfirm={() =>
            handleDelete(
              selectedWorkspace,
              deleteWorkspace,
              setShowDeleteModal,
              setSelectedWorkspace,
              setSubmitting
            )
          }
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default Workspaces;
