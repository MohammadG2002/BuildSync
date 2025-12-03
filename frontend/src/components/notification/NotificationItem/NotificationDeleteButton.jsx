import { X } from "lucide-react";
import styles from "../NotificationBell/NotificationBell.module.css";

const NotificationDeleteButton = ({ onDelete }) => {
  return (
    <button onClick={onDelete} className={styles.deleteButton}>
      <X className={styles.deleteIcon} />
    </button>
  );
};

export default NotificationDeleteButton;
