import { Calendar, Clock } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import styles from "./DeadlineItem.module.css";

const DeadlineItem = ({ deadline }) => {
  const badgeClass =
    deadline.daysLeft <= 5 ? styles.badgeUrgent : styles.badgeNormal;

  return (
    <div className={styles.deadlineItem}>
      <div className={styles.deadlineHeader}>
        <h4 className={styles.deadlineTitle}>{deadline.title}</h4>
        <span className={`${styles.deadlineBadge} ${badgeClass}`}>
          {deadline.daysLeft}d
        </span>
      </div>
      <div className={styles.deadlineMeta}>
        <Calendar className={styles.deadlineMetaIcon} />
        <span>{formatDate(deadline.dueDate)}</span>
        <span className={styles.deadlineMetaSeparator}>•</span>
        <span className={styles.deadlineType}>{deadline.type}</span>
      </div>
    </div>
  );
};

export default DeadlineItem;
