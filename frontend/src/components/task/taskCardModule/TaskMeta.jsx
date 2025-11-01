import { Calendar } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
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
            <div
              key={assignee._id || assignee.id || index}
              className={styles.assigneeAvatar}
              style={{
                backgroundColor: generateColor(
                  assignee?.name || "Unknown User"
                ),
              }}
              title={assignee?.name || "Unknown User"}
            >
              {getInitials(assignee?.name || "U")}
            </div>
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
