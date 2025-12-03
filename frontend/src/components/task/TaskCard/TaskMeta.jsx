import { Calendar } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import UserAvatar from "../../common/UserAvatar/UserAvatar";
import styles from "./TaskCard.module.css";

const TaskMeta = ({ task }) => {
  const statusClasses = {
    todo: styles.statusTodo,
    "in-progress": styles.statusInProgress,
    review: styles.statusReview,
    completed: styles.statusCompleted,
    blocked: styles.statusBlocked,
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

      {/* Assignees */}
      {task.assignedTo && task.assignedTo.length > 0 && (
        <div className={styles.assigneeContainer}>
          {task.assignedTo.slice(0, 3).map((assignee, index) => (
            <UserAvatar
              key={assignee._id || assignee.id || index}
              name={assignee?.name || "Unknown User"}
              avatar={assignee?.avatar}
              className={styles.assigneeAvatar}
              title={assignee?.name || "Unknown User"}
            />
          ))}
          {task.assignedTo.length > 3 && (
            <div
              className={styles.assigneeAvatar}
              title={`+${task.assignedTo.length - 3} more`}
            >
              +{task.assignedTo.length - 3}
            </div>
          )}
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
