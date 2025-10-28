const TaskTitle = ({ title, completed }) => {
  return (
    <h3
      className={`text-base font-semibold text-gray-900 dark:text-gray-100 ${
        completed
          ? "line-through text-gray-500 dark:text-gray-400 dark:text-gray-500"
          : ""
      }`}
    >
      {title}
    </h3>
  );
};

export default TaskTitle;
