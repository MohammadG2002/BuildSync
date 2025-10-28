const AccountInfo = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Account Status
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Your account is active and in good standing
          </p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          Active
        </span>
      </div>

      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Member Since
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            When you joined the platform
          </p>
        </div>
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {user?.createdDate
            ? new Date(user.createdDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "January 2024"}
        </p>
      </div>

      <div className="flex justify-between items-center py-3">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Verified
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Your email address has been verified
          </p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          Verified
        </span>
      </div>
    </div>
  );
};

export default AccountInfo;
