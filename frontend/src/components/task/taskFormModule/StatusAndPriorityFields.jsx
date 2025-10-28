import { TASK_STATUS, TASK_PRIORITY } from "../../../utils/constants";

const StatusAndPriorityFields = ({ status, priority, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          name="status"
          value={status}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          {Object.entries(TASK_STATUS).map(([key, value]) => (
            <option key={value} value={value}>
              {key.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Priority
        </label>
        <select
          name="priority"
          value={priority}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          {Object.entries(TASK_PRIORITY).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StatusAndPriorityFields;
