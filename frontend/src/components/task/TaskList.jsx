import { groupTasks, getGroupTitle, TaskGroup } from "./taskListModule";

const TaskList = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onTaskClick,
  groupBy = "none", // 'none', 'status', 'priority'
}) => {
  const groupedTasks = groupTasks(tasks, groupBy);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([group, groupTasks]) => (
        <div key={group}>
          {groupBy !== "none" && (
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              {getGroupTitle(group, groupBy)} ({groupTasks.length})
            </h3>
          )}
          <TaskGroup
            tasks={groupTasks}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onStatusChange={onStatusChange}
            onTaskClick={onTaskClick}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
