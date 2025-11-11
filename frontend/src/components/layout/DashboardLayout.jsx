import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Onboarding from "../common/Onboarding";
import { useWorkspace } from "../../hooks/useWorkspace";
import styles from "./DashboardLayout.module.css";

const DashboardLayout = () => {
  const { fetchWorkspaces } = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className={styles.mainContainer}>
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>

      {/* Keyboard Shortcuts Helper removed */}

      {/* Onboarding Tour */}
      <Onboarding />
    </div>
  );
};

export default DashboardLayout;
