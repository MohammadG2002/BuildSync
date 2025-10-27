import TaskCard from "./TaskCard";

const TaskList = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onTaskClick,
  groupBy = "none", // 'none', 'status', 'priority'
}) => {
  const groupTasks = () => {
    if (groupBy === "none") {
      return { "All Tasks": tasks };
    }

    const grouped = {};
    tasks.forEach((task) => {
      const key = task[groupBy];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(task);
    });

    return grouped;
  };

  const groupedTasks = groupTasks();

  const getGroupTitle = (key) => {
    if (groupBy === "status") {
      return key.replace("_", " ").toUpperCase();
    }
    if (groupBy === "priority") {
      return `${key.toUpperCase()} PRIORITY`;
    }
    return key;
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([group, groupTasks]) => (
        <div key={group}>
          {groupBy !== "none" && (
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              {getGroupTitle(group)} ({groupTasks.length})
            </h3>
          )}
          <div className="space-y-3">
            {groupTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
                onClick={onTaskClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
