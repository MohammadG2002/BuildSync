import { MoreVertical } from "lucide-react";
import styles from "./MemberMenuButton.module.css";

const MemberMenuButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles.menuButton}>
      <MoreVertical className={styles.menuIcon} />
    </button>
  );
};

export default MemberMenuButton;
