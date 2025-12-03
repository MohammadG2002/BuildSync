import { MessageSquare, Settings } from "lucide-react";
import NotificationBell from "../../notification/NotificationBell";
import ThemeToggle from "../../common/themeToggle/ThemeToggle";
import GlobalSearch from "../../common/globalSearch/GlobalSearch";
import styles from "./Navbar.module.css";

const AIIcon = (props) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: "2px solid #222e3a",
      background: "transparent",
    }}
  >
    <svg
      width={22}
      height={22}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="4"
        y="8"
        width="20"
        height="14"
        rx="7"
        fill="#fff"
        stroke="#1f2937"
        strokeWidth="2"
      />
      <circle cx="10" cy="15" r="2" fill="#1f2937" />
      <circle cx="18" cy="15" r="2" fill="#1f2937" />
      <rect x="11" y="19" width="6" height="2" rx="1" fill="#1f2937" />
      <rect x="12.5" y="4" width="3" height="6" rx="1.5" fill="#1f2937" />
    </svg>
  </span>
);

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

      {/* Chat - AI Icon */}
      <button
        onClick={onChatClick}
        className={styles.actionButton}
        title="AI Chat"
      >
        <AIIcon className={styles.actionIcon} />
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
