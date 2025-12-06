import { Clock } from "lucide-react";
import styles from "./ActivityEmptyState.module.css";

const ActivityEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <Clock className={styles.emptyIcon} />
      <p className={styles.emptyText}>No activities yet</p>
    </div>
  );
};

export default ActivityEmptyState;
