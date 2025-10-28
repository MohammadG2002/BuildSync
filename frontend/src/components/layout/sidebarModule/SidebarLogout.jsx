import { LogOut } from "lucide-react";

const SidebarLogout = ({ collapsed, onLogout }) => {
  return (
    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span className="font-medium">Logout</span>}
      </button>
    </div>
  );
};

export default SidebarLogout;
