import Card from "../../../components/common/Card";

const PrivacySettings = () => {
  return (
    <Card title="Privacy & Access">
      <div className="space-y-4">
        <div>
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Private Workspace
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Only invited members can access this workspace
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
                Allow Member Invites
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Let members invite other people to this workspace
              </p>
            </div>
          </label>
        </div>
      </div>
    </Card>
  );
};

export default PrivacySettings;
