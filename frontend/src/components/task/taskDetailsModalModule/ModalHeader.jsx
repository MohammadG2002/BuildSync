import { X } from "lucide-react";
import { statusColors, priorityColors } from "./colors";
import styles from "./TaskDetailsModal.module.css";

const ModalHeader = ({ task, onClose, onStatusChange, onPriorityChange }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <h2 className={styles.headerTitle}>{task.title}</h2>
        <div className={styles.headerMeta}>
          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`${styles.statusSelect} ${statusColors[task.status]}`}
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
