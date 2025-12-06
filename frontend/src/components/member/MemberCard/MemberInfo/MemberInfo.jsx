import { Mail } from "lucide-react";
import styles from "./MemberInfo.module.css";

const MemberInfo = ({ member, isCurrentUser }) => {
  return (
    <div className={styles.infoContent}>
      <div className={styles.infoHeader}>
        <h3 className={styles.infoName}>{member.name}</h3>
        {isCurrentUser && <span className={styles.infoBadge}>You</span>}
      </div>
      <div className={styles.infoEmailContainer}>
        <Mail className={styles.infoEmailIcon} />
        <span className={styles.infoEmail}>{member.email}</span>
      </div>
    </div>
  );
};

export default MemberInfo;
