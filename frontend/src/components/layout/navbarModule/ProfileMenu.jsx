import ProfileButton from "./ProfileButton";
import ProfileDropdown from "./ProfileDropdown";
import styles from "./Navbar.module.css";

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
