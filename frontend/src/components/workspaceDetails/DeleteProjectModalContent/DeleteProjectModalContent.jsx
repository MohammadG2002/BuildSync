import Button from "../../common/button/Button";
import styles from "../../../pages/workspaces/WorkspaceDetails.module.css";

const DeleteProjectModalContent = ({
  projectName,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <div className={styles.deleteContent}>
      <p className={styles.deleteText}>
        Are you sure you want to delete <strong>{projectName}</strong>? This
        action cannot be undone and will delete all tasks within this project.
      </p>
      <div className={styles.deleteActions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Delete Project
        </Button>
      </div>
    </div>
  );
};

export default DeleteProjectModalContent;
