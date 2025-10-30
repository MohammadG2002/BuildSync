import styles from "../../pages/archived/Archived.module.css";

const getStatusClass = (status) => {
  const statusMap = {
    todo: styles.statusTodo,
    in_progress: styles.statusInProgress,
    in_review: styles.statusInReview,
    done: styles.statusDone,
  };
  return `${styles.statusBadge} ${statusMap[status] || styles.statusTodo}`;
};

export default getStatusClass;
