const TaskDescription = ({ description }) => {
  if (!description) return null;

  return (
    <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-3 line-clamp-2">
      {description}
    </p>
  );
};

export default TaskDescription;
