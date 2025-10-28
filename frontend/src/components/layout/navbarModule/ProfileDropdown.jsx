import { User, Settings, LogOut } from "lucide-react";

const ProfileDropdown = ({
  user,
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {user?.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user?.email}
        </div>
      </div>
      <button
        onClick={onProfileClick}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-800 dark:text-gray-200"
      >
        <User className="w-4 h-4" />
        <span>Profile</span>
      </button>
      <button
        onClick={onSettingsClick}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-800 dark:text-gray-200"
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </button>
      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
