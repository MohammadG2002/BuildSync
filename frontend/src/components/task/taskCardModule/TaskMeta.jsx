import { Calendar } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import styles from "./TaskCard.module.css";

const TaskMeta = ({ task }) => {
  const statusClasses = {
    todo: styles.statusTodo,
    "in-progress": styles.statusInProgress,
    completed: styles.statusCompleted,
  };

  const priorityDotClasses = {
    low: styles.priorityDotLow,
    medium: styles.priorityDotMedium,
    high: styles.priorityDotHigh,
  };

  const priorityTextClasses = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
  };

  return (
    <div className={styles.meta}>
      {/* Status Badge */}
      <span
        className={`${styles.statusBadge} ${
          statusClasses[task.status] || styles.statusTodo
        }`}
      >
        {task.status.replace(/-/g, " ")}
      </span>

      {/* Priority */}
      <div className={styles.priorityContainer}>
        <div
          className={`${styles.priorityDot} ${
            priorityDotClasses[task.priority]
          }`}
        ></div>
        <span
          className={`${styles.priorityText} ${
            priorityTextClasses[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Assignee */}
      {task.assignee && (
        <div className={styles.assigneeContainer}>
          <div
            className={styles.assigneeAvatar}
            style={{ backgroundColor: generateColor(task.assignee.name) }}
          >
            {getInitials(task.assignee.name)}
          </div>
          <span className={styles.assigneeName}>{task.assignee.name}</span>
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className={styles.dueDateContainer}>
          <Calendar className={styles.dueDateIcon} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  );
};

export default TaskMeta;
