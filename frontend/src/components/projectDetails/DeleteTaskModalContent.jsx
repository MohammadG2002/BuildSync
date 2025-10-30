import Button from "../../../components/common/Button";
import styles from "../ProjectDetails.module.css";

const DeleteTaskModalContent = ({
  taskTitle,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <div className={styles.deleteContent}>
      <p className={styles.deleteText}>
        Are you sure you want to delete <strong>{taskTitle}</strong>? This
        action cannot be undone.
      </p>
      <div className={styles.deleteActions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Delete Task
        </Button>
      </div>
    </div>
  );
};

export default DeleteTaskModalContent;
