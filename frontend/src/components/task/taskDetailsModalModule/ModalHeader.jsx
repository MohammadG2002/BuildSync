import { X, SquarePen, Check, X as CloseSmall } from "lucide-react";
import { useState } from "react";
import { statusColors, priorityColors } from "../../../utils/task/colors";
import styles from "./TaskDetailsModal.module.css";

const ModalHeader = ({
  task,
  onClose,
  onStatusChange,
  onPriorityChange,
  onRename,
  readOnly = false,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title || "");

  const startEdit = () => {
    if (readOnly) return;
    setEditedTitle(task.title || "");
    setIsEditingTitle(true);
  };

  const cancelEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle(task.title || "");
  };

  const saveEdit = () => {
    const title = (editedTitle || "").trim();
    if (!title || readOnly) {
      setIsEditingTitle(false);
      setEditedTitle(task.title || "");
      return;
    }
    onRename?.(title);
    setIsEditingTitle(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        {isEditingTitle ? (
          <div className={styles.headerTitleRow}>
            <input
              className={styles.headerTitleInput}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={saveEdit}
              className={styles.iconButton}
              title="Save"
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className={styles.iconButton}
              title="Cancel"
            >
              <CloseSmall size={18} />
            </button>
          </div>
        ) : (
          <div className={styles.headerTitleRow}>
            <h2 className={styles.headerTitle}>{task.title}</h2>
            {!readOnly && (
              <button
                type="button"
                onClick={startEdit}
                className={styles.iconButton}
                title="Edit title"
              >
                <SquarePen size={18} />
              </button>
            )}
          </div>
        )}
        <div className={styles.headerMeta}>
          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`${styles.statusSelect} ${statusColors[task.status]}`}
            disabled={readOnly}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={task.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className={`${styles.prioritySelect} ${
              priorityColors[task.priority]
            }`}
            disabled={readOnly}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <button onClick={onClose} className={styles.closeButton}>
        <X className={styles.closeIcon} />
      </button>
    </div>
  );
};

export default ModalHeader;
