import { X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Sidebar.module.css";

const SidebarHeader = ({ collapsed, onCollapse, onClose }) => {
  return (
    <div className={styles.header}>
      {!collapsed && (
        <h1 className={styles.headerTitle}>
          {import.meta.env.VITE_APP_NAME || "BuildSync"}
        </h1>
      )}

      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className={`${styles.headerButton} ${styles.headerButtonMobile}`}
      >
        <X className={styles.headerIcon} />
      </button>

      {/* Collapse button (desktop) */}
      <button
        onClick={onCollapse}
        className={`${styles.headerButton} ${styles.headerButtonDesktop}`}
      >
        {collapsed ? (
          <ChevronRight className={styles.headerIcon} />
        ) : (
          <ChevronLeft className={styles.headerIcon} />
        )}
      </button>
    </div>
  );
};

export default SidebarHeader;
