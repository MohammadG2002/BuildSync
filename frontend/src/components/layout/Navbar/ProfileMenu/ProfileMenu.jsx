import ProfileButton from "../ProfileButton/ProfileButton";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import styles from "./ProfileMenu.module.css";

const ProfileMenu = ({
  user,
  showMenu,
  onToggleMenu,
  onProfileClick,
  onSettingsClick,
  onLogout,
  menuRef,
}) => {
  return (
    <div className={styles.profileContainer} ref={menuRef}>
      <ProfileButton user={user} onClick={onToggleMenu} />

      {showMenu && (
        <ProfileDropdown
          user={user}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};

export default ProfileMenu;
