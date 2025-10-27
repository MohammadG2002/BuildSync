import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  Settings,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
import { getInitials, generateColor } from "../../utils/helpers";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const workspaceMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

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
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
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

  // Mock notifications (replace with real data)
  const notifications = [
    {
      id: 1,
      title: "New task assigned",
      message: 'You have been assigned to "Update Documentation"',
      time: "5m ago",
      read: false,
    },
    {
      id: 2,
      title: "Project updated",
      message: "Website Redesign project has been updated",
      time: "1h ago",
      read: false,
    },
    {
      id: 3,
      title: "Member added",
      message: "John Doe joined Marketing Team",
      time: "3h ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Workspace Selector */}
      <div className="relative" ref={workspaceMenuRef}>
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-800">
            {currentWorkspace?.name || "Select Workspace"}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {/* Workspace Dropdown */}
        {showWorkspaceMenu && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
              Your Workspaces
            </div>
            <div className="max-h-64 overflow-y-auto">
              {workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                      currentWorkspace?.id === workspace.id
                        ? "bg-primary-50 text-primary-600"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{workspace.name}</div>
                    <div className="text-xs text-gray-500">
                      {workspace.description}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No workspaces available
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={() => {
                  navigate("/app/workspaces");
                  setShowWorkspaceMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-gray-50 transition-colors"
              >
                + Create New Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-gray-800">
                          {notification.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
              <div className="px-4 py-3 border-t border-gray-200 text-center">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat */}
        <button
          onClick={() => navigate("/app/chat")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-gray-600" />
        </button>

        {/* Settings */}
        <button
          onClick={() =>
            navigate(`/app/workspaces/${currentWorkspace?.id}/settings`)
          }
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={!currentWorkspace}
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
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
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={() => {
                  navigate("/app/profile");
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate("/app/settings");
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
