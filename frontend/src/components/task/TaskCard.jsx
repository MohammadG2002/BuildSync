import { useState, useRef, useEffect } from "react";
import {
  TaskCheckbox,
  TaskMenu,
  TaskTitle,
  TaskDescription,
  TaskMeta,
  TaskProgress,
} from "./taskCardModule";
import styles from "./taskCardModule/TaskCard.module.css";

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
            />

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

          <TaskDescription description={task.description} />
          {/* Subtasks progress bar (only if subtasks exist) */}
          <TaskProgress
            taskId={task._id}
            subtasks={Array.isArray(task?.subtasks) ? task.subtasks : []}
          />
          <TaskMeta task={task} />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
