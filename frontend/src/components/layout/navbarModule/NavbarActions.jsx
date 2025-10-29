import { MessageSquare, Settings } from "lucide-react";
import NotificationBell from "../../notification/NotificationBell";
import ThemeToggle from "../../common/ThemeToggle";
import GlobalSearch from "../../common/GlobalSearch";
import styles from "./Navbar.module.css";

const NavbarActions = ({ onChatClick, onSettingsClick, currentWorkspace }) => {
  return (
    <div className={styles.actionsContainer}>
      {/* Global Search - Hidden on small screens */}
      <div className={styles.searchContainer}>
        <GlobalSearch />
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Notification Bell */}
      <NotificationBell />

      {/* Chat */}
      <button onClick={onChatClick} className={styles.actionButton}>
        <MessageSquare className={styles.actionIcon} />
      </button>

      {/* Settings */}
      <button
        onClick={onSettingsClick}
        className={styles.actionButton}
        disabled={!currentWorkspace}
      >
        <Settings className={styles.actionIcon} />
      </button>
    </div>
  );
};

export default NavbarActions;
