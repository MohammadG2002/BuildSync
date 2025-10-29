import styles from "../Archived.module.css";

const getPriorityClass = (priority) => {
  const priorityMap = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
    urgent: styles.priorityUrgent,
  };
  return `${styles.priorityBadge} ${
    priorityMap[priority] || styles.priorityLow
  }`;
};

export default getPriorityClass;
