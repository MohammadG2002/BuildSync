import { getInitials, generateColor } from "../../../utils/helpers";
import styles from "./MemberCard.module.css";

const MemberAvatar = ({ member }) => {
  return (
    <div
      className={styles.avatar}
      style={{ backgroundColor: generateColor(member.userId) }}
    >
      {getInitials(member.name)}
    </div>
  );
};

export default MemberAvatar;
