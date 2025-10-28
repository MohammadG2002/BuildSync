import { NavLink, useLocation } from "react-router-dom";

const SidebarNavItem = ({ item, currentWorkspace, collapsed }) => {
  const location = useLocation();
  const Icon = item.icon;
  const isDisabled = item.requiresWorkspace && !currentWorkspace;
  const isActive = item.path !== "#" && location.pathname === item.path;

  return (
    <NavLink
      to={item.path}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
        }
      }}
      className={() =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
          isActive
            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
            : isDisabled
            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{item.name}</span>}
    </NavLink>
  );
};

export default SidebarNavItem;
