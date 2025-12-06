import { groupTasks, getGroupTitle } from "../../../../utils/task/groupTasks";
import TaskGroup from "../TaskGroup/TaskGroup";
import styles from "./TaskList.module.css";

const TaskList = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onArchiveTask,
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
            onArchiveTask={onArchiveTask}
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
