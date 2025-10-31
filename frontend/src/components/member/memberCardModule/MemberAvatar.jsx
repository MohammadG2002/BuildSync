import { getInitials, generateColor } from "../../../utils/helpers";
import styles from "./MemberCard.module.css";

const MemberAvatar = ({ member }) => {
  return (
    <div
      className={styles.avatar}
      style={{ backgroundColor: generateColor(member.id) }}
    >
      {getInitials(member.name)}
    </div>
  );
};

export default MemberAvatar;
