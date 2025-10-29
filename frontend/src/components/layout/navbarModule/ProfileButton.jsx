import { getInitials, generateColor } from "../../../utils/helpers";
import styles from "./Navbar.module.css";

const ProfileButton = ({ user, onClick }) => {
  return (
    <button onClick={onClick} className={styles.profileButton}>
      <div
        className={styles.profileAvatar}
        style={{ backgroundColor: generateColor(user?.name || "User") }}
      >
        {getInitials(user?.name || "User")}
      </div>
    </button>
  );
};

export default ProfileButton;
