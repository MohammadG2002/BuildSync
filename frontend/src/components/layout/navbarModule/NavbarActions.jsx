import { MessageSquare, Settings } from "lucide-react";
import NotificationBell from "../../notification/NotificationBell";
import ThemeToggle from "../../common/ThemeToggle";
import GlobalSearch from "../../common/GlobalSearch";

const NavbarActions = ({ onChatClick, onSettingsClick, currentWorkspace }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Global Search - Hidden on small screens */}
      <div className="hidden md:block">
        <GlobalSearch />
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Notification Bell */}
      <NotificationBell />

      {/* Chat */}
      <button
        onClick={onChatClick}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Settings */}
      <button
        onClick={onSettingsClick}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        disabled={!currentWorkspace}
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

export default NavbarActions;
