import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  getMenuItems,
  SidebarBackdrop,
  SidebarHeader,
  SidebarNav,
  SidebarLogout,
} from "./sidebarModule";
import styles from "./sidebarModule/Sidebar.module.css";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = getMenuItems(currentWorkspace);

  const handleLogout = () => {
    logout();
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [currentWorkspace]);

  const sidebarClasses = [
    styles.sidebar,
    collapsed ? styles.sidebarCollapsed : styles.sidebarExpanded,
    isOpen ? styles.sidebarOpen : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <SidebarBackdrop isOpen={isOpen} onClose={onClose} />

      {/* Sidebar */}
      <aside data-onboarding="sidebar" className={sidebarClasses}>
        <SidebarHeader
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          onClose={onClose}
        />

        <SidebarNav
          menuItems={menuItems}
          currentWorkspace={currentWorkspace}
          collapsed={collapsed}
        />

        <SidebarLogout collapsed={collapsed} onLogout={handleLogout} />
      </aside>
    </>
  );
};

export default Sidebar;
