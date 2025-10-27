import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import KeyboardShortcuts from "../common/KeyboardShortcuts";
import Onboarding from "../common/Onboarding";
import { useWorkspace } from "../../hooks/useWorkspace";

const DashboardLayout = () => {
  const { fetchWorkspaces } = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>

      {/* Keyboard Shortcuts Helper */}
      <KeyboardShortcuts />

      {/* Onboarding Tour */}
      <Onboarding />
    </div>
  );
};

export default DashboardLayout;
