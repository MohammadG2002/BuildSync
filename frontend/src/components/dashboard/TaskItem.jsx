import { Calendar } from "lucide-react";
import { formatDate } from "../../utils/helpers";
import styles from "./Dashboard.module.css";

const TaskItem = ({ task }) => {
  const priorityClass = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
    urgent: styles.priorityUrgent,
  }[task.priority];

  return (
    <div className={styles.taskItem}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {}}
        className={styles.taskCheckbox}
      />
      <div className={styles.taskContent}>
        <h4
          className={`${styles.taskTitle} ${
            task.completed ? styles.taskTitleCompleted : ""
          }`}
        >
          {task.title}
        </h4>
        <div className={styles.taskMeta}>
          <p className={styles.taskProject}>{task.project}</p>
          <span className={`${styles.taskPriority} ${priorityClass}`}>
            {task.priority}
          </span>
          <div className={styles.taskDate}>
            <Calendar className={styles.taskDateIcon} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
