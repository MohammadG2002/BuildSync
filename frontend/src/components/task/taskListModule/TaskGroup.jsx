import TaskCard from "../TaskCard";

const TaskGroup = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onTaskClick,
}) => {
  return (
    <div className="space-y-3">
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
