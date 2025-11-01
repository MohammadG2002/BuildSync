import TaskCard from "../TaskCard";
import styles from "./TaskList.module.css";

const TaskGroup = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onTaskClick,
  readOnly = false,
}) => {
  return (
    <div className={styles.taskGroup}>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onStatusChange={onStatusChange}
          onClick={onTaskClick}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default TaskGroup;
