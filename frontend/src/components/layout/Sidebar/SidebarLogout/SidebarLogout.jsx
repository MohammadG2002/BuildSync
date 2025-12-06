import { LogOut } from "lucide-react";
import styles from "./SidebarLogout.module.css";

const SidebarLogout = ({ collapsed, onLogout }) => {
  return (
    <div className={styles.logoutContainer}>
      <button onClick={onLogout} className={styles.logoutButton}>
        <LogOut className={styles.logoutIcon} />
        {!collapsed && <span className={styles.logoutText}>Logout</span>}
      </button>
    </div>
  );
};

export default SidebarLogout;
