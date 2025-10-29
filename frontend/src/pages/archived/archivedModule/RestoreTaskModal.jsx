import { RotateCcw } from "lucide-react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import styles from "../Archived.module.css";

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
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restore Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RestoreTaskModal;
