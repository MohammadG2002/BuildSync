import { useState, useRef, useEffect } from "react";
import {
  TaskCheckbox,
  TaskMenu,
  TaskTitle,
  TaskDescription,
  TaskProgress,
} from "./taskCardModule";
import styles from "./taskCardModule/TaskCard.module.css";
import { formatDate, getRelativeTime } from "../../utils/helpers";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onClick,
  readOnly = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e) => {
    if (
      e.target.closest(".menu-button") ||
      e.target.closest(".menu-dropdown") ||
      e.target.closest(".checkbox-wrapper")
    ) {
      return;
    }
    onClick?.(task);
  };

  // Map task status to badge style classes
  const statusClasses = {
    todo: styles.statusTodo,
    "in-progress": styles.statusInProgress,
    review: styles.statusReview,
    completed: styles.statusCompleted,
    blocked: styles.statusBlocked,
  };

  const priorityTextClasses = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.cardContent}>
        <TaskCheckbox
          checked={task.status === "completed"}
          onChange={(e) => {
            e.stopPropagation();
            if (!readOnly) {
              onStatusChange?.(task, e.target.checked ? "completed" : "todo");
            }
          }}
          disabled={readOnly}
        />

        <div className={styles.contentArea}>
          <div className={styles.header}>
            <TaskTitle
              title={task.title}
              completed={task.status === "completed"}
              sequence={task.sequence}
            />
            <div className={styles.headerRight}>
              {/* Status Badge on the right */}
              <span
                className={`${styles.statusBadge} ${
                  statusClasses[task.status] || styles.statusTodo
                }`}
              >
                {String(task.status || "todo").replace(/-/g, " ")}
              </span>
              {!readOnly && (
                <div ref={menuRef}>
                  <TaskMenu
                    showMenu={showMenu}
                    onToggle={() => setShowMenu(!showMenu)}
                    onEdit={(t) => {
                      onEdit(t);
                      setShowMenu(false);
                    }}
                    onDelete={(t) => {
                      onDelete(t);
                      setShowMenu(false);
                    }}
                    task={task}
                  />
                </div>
              )}
            </div>
          </div>

          <TaskDescription description={task.description} />
          {/* Subtasks progress bar (only if subtasks exist) */}
          <TaskProgress
            taskId={task._id}
            subtasks={Array.isArray(task?.subtasks) ? task.subtasks : []}
          />

          {/* Priority − Due date row */}
          <div className={styles.priorityDueRow}>
            {task.priority && (
              <span
                className={`${styles.priorityText} ${
                  priorityTextClasses[task.priority]
                }`}
              >
                {task.priority}
              </span>
            )}
            {task.priority && task.dueDate && (
              <span className={styles.bulletSeparator}>−</span>
            )}
            {task.dueDate && (
              <span className={styles.dueDateText}>
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {/* Bottom metadata row: #sequence . Creator - opened <relative> */}
          <div className={styles.bottomRow}>
            {typeof task.sequence === "number" && task.sequence > 0 && (
              <span className={styles.bottomMuted}>{`#${task.sequence}`}</span>
            )}
            {typeof task.sequence === "number" && task.sequence > 0 && (
              <span className={styles.dotSeparator}>.</span>
            )}
            {task?.createdBy?.name && (
              <span className={styles.bottomMuted}>{task.createdBy.name}</span>
            )}
            {(task?.createdBy?.name ||
              (typeof task.sequence === "number" && task.sequence > 0)) && (
              <span className={styles.bulletSeparator}>-</span>
            )}
            {task?.createdAt && (
              <span className={styles.bottomMuted}>{`opened ${getRelativeTime(
                task.createdAt
              )}`}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
