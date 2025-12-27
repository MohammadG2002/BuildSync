import { User, Settings, LogOut } from "lucide-react";
import styles from "./ProfileDropdown.module.css";

const ProfileDropdown = ({
  user,
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  return (
    <div className={styles.profileDropdown}>
      <div className={styles.profileDropdownHeader}>
        <div className={styles.profileName}>{user?.name}</div>
        <div className={styles.profileEmail}>{user?.email}</div>
      </div>
      <button onClick={onProfileClick} className={styles.profileMenuItem}>
        <User className={styles.profileMenuIcon} />
        <span>Profile</span>
      </button>
      <div className={styles.profileMenuDivider}></div>
      <button onClick={onLogout} className={styles.logoutButton}>
        <LogOut className={styles.logoutIcon} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
