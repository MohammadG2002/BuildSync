import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Settings,
  User,
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
import NotificationBell from "../notification/NotificationBell";
import ThemeToggle from "../common/ThemeToggle";
import GlobalSearch from "../common/GlobalSearch";
import { getInitials, generateColor } from "../../utils/helpers";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const workspaceMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(event.target)
      ) {
        setShowWorkspaceMenu(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWorkspaceSelect = (workspace) => {
    switchWorkspace(workspace);
    setShowWorkspaceMenu(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 transition-colors">
      {/* Left Side - Mobile Menu + Workspace */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Workspace Selector */}
        <div
          className="relative"
          ref={workspaceMenuRef}
          data-onboarding="workspace-selector"
        >
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
              {currentWorkspace?.name || "Select Workspace"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          </button>

          {/* Workspace Dropdown */}
          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                Your Workspaces
              </div>
              <div className="max-h-64 overflow-y-auto">
                {workspaces.length > 0 ? (
                  workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => handleWorkspaceSelect(workspace)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors ${
                        currentWorkspace?.id === workspace.id
                          ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                          : "text-gray-800 dark:text-gray-100 dark:text-gray-200"
                      }`}
                    >
                      <div className="font-medium">{workspace.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {workspace.description}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    No workspaces available
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  onClick={() => {
                    navigate("/app/workspaces");
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors"
                >
                  + Create New Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Actions */}
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
          onClick={() => navigate("/app/chat")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </button>

        {/* Settings */}
        <button
          onClick={() =>
            navigate(`/app/workspaces/${currentWorkspace?.id}/settings`)
          }
          className="p-2 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 transition-colors"
          disabled={!currentWorkspace}
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: generateColor(user?.name || "User") }}
            >
              {getInitials(user?.name || "User")}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-800 dark:text-gray-100 dark:text-gray-100">
                  {user?.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  {user?.email}
                </div>
              </div>
              <button
                onClick={() => {
                  navigate("/app/profile");
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-800 dark:text-gray-100 dark:text-gray-200"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate(`/app/workspaces/${currentWorkspace?.id}/settings`);
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-800 dark:text-gray-100 dark:text-gray-200"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
