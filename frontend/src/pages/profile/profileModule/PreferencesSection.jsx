const PreferencesSection = () => {
  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          defaultChecked
          className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
        />
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Notifications
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Receive email notifications about your activity
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
            Weekly Summary
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Get a weekly summary of your projects and tasks
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
            Marketing Emails
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Receive updates about new features and tips
          </p>
        </div>
      </label>
    </div>
  );
};

export default PreferencesSection;
