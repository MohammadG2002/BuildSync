const TaskCheckbox = ({ checked, onChange }) => {
  return (
    <div className="checkbox-wrapper pt-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500 cursor-pointer"
      />
    </div>
  );
};

export default TaskCheckbox;
