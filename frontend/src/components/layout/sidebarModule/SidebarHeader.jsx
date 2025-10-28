import { X, ChevronLeft, ChevronRight } from "lucide-react";

const SidebarHeader = ({ collapsed, onCollapse, onClose }) => {
  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
      {!collapsed && (
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          {import.meta.env.VITE_APP_NAME || "BuildSync"}
        </h1>
      )}

      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Collapse button (desktop) */}
      <button
        onClick={onCollapse}
        className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default SidebarHeader;
