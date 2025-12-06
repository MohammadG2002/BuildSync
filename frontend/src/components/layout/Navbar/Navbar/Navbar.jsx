import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { useWorkspace } from "../../../../hooks/useWorkspace";
import { createClickOutsideHandler } from "../../../../utils/layout/handleClickOutside";
import { getWorkspaceSwitchPath } from "../../../../utils/layout/workspaceSwitcher";
import MobileMenuButton from "../MobileMenuButton/MobileMenuButton";
import WorkspaceSelector from "../WorkspaceSelector/WorkspaceSelector";
import NavbarActions from "../NavbarActions/NavbarActions";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import styles from "./Navbar.module.css";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const workspaceMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = createClickOutsideHandler(
      {
        workspaceMenu: workspaceMenuRef,
        profileMenu: profileMenuRef,
      },
      {
        workspaceMenu: setShowWorkspaceMenu,
        profileMenu: setShowProfileMenu,
      }
    );

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleWorkspaceSelect = (workspace) => {
    switchWorkspace(workspace);
    setShowWorkspaceMenu(false);

    // Navigate to the appropriate page based on current location
    const newPath = getWorkspaceSwitchPath(location.pathname, workspace.id);
    navigate(newPath);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={styles.navbar}>
      {/* Left Side - Mobile Menu + Workspace */}
      <div className={styles.leftSection}>
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
      <div className={styles.rightSection}>
        <NavbarActions
          onChatClick={() => navigate("/app/chat/ai")}
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
