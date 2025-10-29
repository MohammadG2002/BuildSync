import { formatDate } from "../../../utils/helpers";
import styles from "./TaskDetailsModal.module.css";

const ModalFooter = ({ createdAt, updatedAt }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <span>Created {formatDate(createdAt)}</span>
        <span>Updated {formatDate(updatedAt)}</span>
      </div>
    </div>
  );
};

export default ModalFooter;
