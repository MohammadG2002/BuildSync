import Button from "../../common/button/Button/Button";
import styles from "./ArchiveTaskModalContent.module.css";

const ArchiveTaskModalContent = ({
  taskTitle,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <div className={styles.deleteContent}>
      <p className={styles.deleteText}>
        Archive <strong>{taskTitle}</strong>? Archived tasks are moved out of
        active views and can be restored later from the Archived Tasks page.
      </p>
      <div className={styles.deleteActions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="warning" onClick={onConfirm} loading={loading}>
          Archive Task
        </Button>
      </div>
    </div>
  );
};

export default ArchiveTaskModalContent;
