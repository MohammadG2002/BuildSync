import { Calendar } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import UserAvatar from "../../common/UserAvatar";
import styles from "./TaskItem.module.css";

const TaskItem = ({ task, onClick }) => {
  const priorityClass =
    {
      low: styles.priorityLow,
      medium: styles.priorityMedium,
      high: styles.priorityHigh,
      urgent: styles.priorityUrgent,
    }[task?.priority] || "";

  // Compute subtask progress if available
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = totalSubtasks
    ? subtasks.filter((s) => s?.completed).length
    : 0;
  const subtaskPercent = totalSubtasks
    ? Math.round((completedSubtasks / totalSubtasks) * 100)
    : 0;

  const handleContainerClick = () => {
    onClick?.(task);
  };

  return (
    <div className={styles.taskItem} onClick={handleContainerClick}>
      <div className={styles.taskContent}>
        <h4
          className={`${styles.taskTitle} ${
            String(task?.status).toLowerCase() === "completed"
              ? styles.taskTitleCompleted
              : ""
          }`}
        >
          {task?.title || "Untitled Task"}
        </h4>
        <div className={styles.taskMeta}>
          <p className={styles.taskProject}>
            {task?.project?.name || task?.projectName || ""}
          </p>
          <span className={`${styles.taskPriority} ${priorityClass}`}>
            {task?.priority || ""}
          </span>
          <div className={styles.taskDate}>
            <Calendar className={styles.taskDateIcon} />
            <span>{formatDate(task?.dueDate)}</span>
          </div>
        </div>

        {/* Assignees (up to 3) */}
        {Array.isArray(task?.assignedTo) && task.assignedTo.length > 0 && (
          <div className={styles.taskAssignees} style={{ marginTop: "0.5rem" }}>
            {task.assignedTo.slice(0, 3).map((assignee, index) => (
              <UserAvatar
                key={assignee._id || assignee.id || index}
                name={assignee?.name || assignee?.email || "User"}
                avatar={assignee?.avatar}
                className={styles.memberAvatar}
                title={assignee?.name || assignee?.email || "User"}
              />
            ))}
            {task.assignedTo.length > 3 && (
              <div
                className={styles.memberAvatar}
                style={{ backgroundColor: "#9ca3af" }}
                title={`+${task.assignedTo.length - 3} more`}
              >
                +{task.assignedTo.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Subtasks progress bar */}
        {totalSubtasks > 0 && (
          <div
            className={styles.projectProgress}
            style={{ marginTop: "0.5rem" }}
          >
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Subtasks</span>
              <span className={styles.progressValue}>
                {completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${subtaskPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
