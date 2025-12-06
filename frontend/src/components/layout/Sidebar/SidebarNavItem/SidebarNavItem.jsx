import { NavLink, useLocation } from "react-router-dom";
import styles from "./SidebarNavItem.module.css";

const SidebarNavItem = ({ item, currentWorkspace, collapsed }) => {
  const location = useLocation();
  const Icon = item.icon;
  const isDisabled = item.requiresWorkspace && !currentWorkspace;
  const isActive = item.path !== "#" && location.pathname === item.path;

  const navItemClasses = [
    styles.navItem,
    isActive ? styles.navItemActive : "",
    isDisabled ? styles.navItemDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <NavLink
      to={item.path}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
        }
      }}
      className={navItemClasses}
    >
      <Icon className={styles.navItemIcon} />
      {!collapsed && <span className={styles.navItemText}>{item.name}</span>}
    </NavLink>
  );
};

export default SidebarNavItem;
