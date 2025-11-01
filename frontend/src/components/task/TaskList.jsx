import { groupTasks, getGroupTitle, TaskGroup } from "./taskListModule";
import styles from "./taskListModule/TaskList.module.css";

const TaskList = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onTaskClick,
  groupBy = "none", // 'none', 'status', 'priority'
  readOnly = false,
}) => {
  const groupedTasks = groupTasks(tasks, groupBy);

  return (
    <div className={styles.container}>
      {Object.entries(groupedTasks).map(([group, groupTasks]) => (
        <div key={group}>
          {groupBy !== "none" && (
            <h3 className={styles.groupHeader}>
              {getGroupTitle(group, groupBy)} ({groupTasks.length})
            </h3>
          )}
          <TaskGroup
            tasks={groupTasks}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onStatusChange={onStatusChange}
            onTaskClick={onTaskClick}
            readOnly={readOnly}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
