import Card from "../../../components/common/Card";

const NotificationPreferences = () => {
  return (
    <Card title="Notification Preferences">
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Task Assignments
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified when you're assigned to a task
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Updates
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified about project changes and updates
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              New Members
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified when new members join the workspace
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Daily Digest
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive a daily summary of workspace activity
            </p>
          </div>
        </label>
      </div>
    </Card>
  );
};

export default NotificationPreferences;
