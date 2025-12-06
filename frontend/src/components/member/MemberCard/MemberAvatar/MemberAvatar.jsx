import UserAvatar from "../../../common/UserAvatar/UserAvatar/UserAvatar";
import styles from "./MemberAvatar.module.css";

const MemberAvatar = ({ member }) => {
  return (
    <UserAvatar
      name={member?.name}
      avatar={member?.avatar}
      className={styles.avatar}
    />
  );
};

export default MemberAvatar;
