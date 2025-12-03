import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import assets from "../../../assets/assets";
import styles from "./Sidebar.module.css";

const SidebarHeader = ({ collapsed, onCollapse, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      {collapsed ? (
        <img
          src={assets.Logo}
          alt="BuildSync"
          className={styles.headerLogoCollapsed}
          onClick={() => navigate("/app/dashboard")}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <div
          className={styles.headerTitleContainer}
          onClick={() => navigate("/app/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img
            src={assets.Logo}
            alt="BuildSync"
            className={styles.headerLogo}
          />
          <h1 className={styles.headerTitle}>
            {import.meta.env.VITE_APP_NAME || "BuildSync"}
          </h1>
        </div>
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
