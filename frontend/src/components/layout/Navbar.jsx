import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  MobileMenuButton,
  WorkspaceSelector,
  NavbarActions,
  ProfileMenu,
} from "./navbarModule";

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
        <MobileMenuButton onClick={onMenuClick} />

        <WorkspaceSelector
          currentWorkspace={currentWorkspace}
          workspaces={workspaces}
          showMenu={showWorkspaceMenu}
          onToggleMenu={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          onSelect={handleWorkspaceSelect}
          onCreateNew={() => {
            navigate("/app/workspaces");
            setShowWorkspaceMenu(false);
          }}
          menuRef={workspaceMenuRef}
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <NavbarActions
          onChatClick={() => navigate("/app/chat")}
          onSettingsClick={() =>
            navigate(`/app/workspaces/${currentWorkspace?.id}/settings`)
          }
          currentWorkspace={currentWorkspace}
        />

        <ProfileMenu
          user={user}
          showMenu={showProfileMenu}
          onToggleMenu={() => setShowProfileMenu(!showProfileMenu)}
          onProfileClick={() => {
            navigate("/app/profile");
            setShowProfileMenu(false);
          }}
          onSettingsClick={() => {
            navigate(`/app/workspaces/${currentWorkspace?.id}/settings`);
            setShowProfileMenu(false);
          }}
          onLogout={handleLogout}
          menuRef={profileMenuRef}
        />
      </div>
    </header>
  );
};

export default Navbar;
