import { PROJECT_STATUS } from "../../../utils/constants";

const StatusField = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Status
      </label>
      <select
        name="status"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
      >
        {Object.entries(PROJECT_STATUS).map(([key, value]) => (
          <option key={value} value={value}>
            {key.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusField;
