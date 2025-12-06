import { getInitials, generateColor } from "../../../../utils/helpers";
import UserAvatar from "../../../common/UserAvatar/UserAvatar";
import styles from "./ProfileButton.module.css";

const ProfileButton = ({ user, onClick }) => {
  return (
    <button onClick={onClick} className={styles.profileButton}>
      <UserAvatar
        name={user?.name || "User"}
        avatar={user?.avatar}
        className={styles.profileAvatar}
      />
    </button>
  );
};

export default ProfileButton;
