import { AlertTriangle } from "lucide-react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Input from "../common/Input";
import styles from "./Settings.module.css";

const DeleteWorkspaceModal = ({
  isOpen,
  workspaceName,
  deleteConfirmation,
  loading,
  onClose,
  onConfirmationChange,
  onDelete,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Workspace" size="md">
      <div className={styles.container}>
        <div className={styles.deleteWarning}>
          <div className={styles.deleteWarningContent}>
            <AlertTriangle
              className={`${styles.deleteWarningIcon} w-5 h-5 text-red-600`}
            />
            <div>
              <h4 className={styles.deleteWarningTitle}>
                This action cannot be undone
              </h4>
              <p className={styles.deleteWarningText}>
                This will permanently delete the{" "}
                <strong>{workspaceName}</strong> workspace, including all
                projects, tasks, and member access.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.deleteConfirmSection}>
          <p className={styles.deleteConfirmLabel}>
            Please type <strong>{workspaceName}</strong> to confirm deletion:
          </p>
          <Input
            type="text"
            placeholder={workspaceName}
            value={deleteConfirmation}
            onChange={onConfirmationChange}
          />
        </div>

        <div className={styles.deleteModalActions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            loading={loading}
            disabled={deleteConfirmation !== workspaceName}
          >
            Delete Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
