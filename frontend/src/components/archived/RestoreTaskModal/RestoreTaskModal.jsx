import { RotateCcw } from "lucide-react";
import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import styles from "./RestoreTaskModal.module.css";

const RestoreTaskModal = ({
  isOpen,
  onClose,
  selectedTask,
  onRestore,
  restoring,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Task" size="sm">
      <div className={styles.modalContent}>
        <p className={styles.modalText}>
          Are you sure you want to restore{" "}
          <strong>{selectedTask?.title}</strong>? This will move the task back
          to its original project.
        </p>
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onRestore}
            loading={restoring}
            className={styles.modalRestoreButton}
          >
            <RotateCcw className={styles.modalRestoreIcon} />
            Restore Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RestoreTaskModal;
