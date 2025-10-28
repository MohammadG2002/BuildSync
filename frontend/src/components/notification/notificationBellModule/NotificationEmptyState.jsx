import { Bell } from "lucide-react";

const NotificationEmptyState = () => {
  return (
    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
      <p>No notifications</p>
    </div>
  );
};

export default NotificationEmptyState;
