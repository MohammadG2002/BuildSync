import UserAvatar from "../../common/UserAvatar";
import styles from "./MemberCard.module.css";

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
