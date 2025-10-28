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

  return (
    <>
      <SidebarBackdrop isOpen={isOpen} onClose={onClose} />

      {/* Sidebar */}
      <aside
        data-onboarding="sidebar"
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
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
