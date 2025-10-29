import TaskCard from "../TaskCard";
import styles from "./TaskList.module.css";

const TaskGroup = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onTaskClick,
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
        />
      ))}
    </div>
  );
};

export default TaskGroup;
