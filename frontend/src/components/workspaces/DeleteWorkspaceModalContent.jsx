import Button from "../common/Button";
import styles from "../../pages/workspaces/Workspaces.module.css";

const DeleteWorkspaceModalContent = ({
  workspaceName,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <div className={styles.deleteContent}>
      <p className={styles.deleteText}>
        Are you sure you want to delete <strong>{workspaceName}</strong>? This
        action cannot be undone and will delete all projects and tasks within
        this workspace.
      </p>
      <div className={styles.deleteActions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Delete Workspace
        </Button>
      </div>
    </div>
  );
};

export default DeleteWorkspaceModalContent;
