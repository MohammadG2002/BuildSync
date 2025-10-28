const GroupBySelector = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Group by:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      >
        <option value="none">None</option>
        <option value="status">Status</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
};

export default GroupBySelector;
