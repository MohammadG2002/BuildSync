import { Menu } from "lucide-react";
import styles from "./MobileMenuButton.module.css";

const MobileMenuButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={styles.mobileMenuButton}
      aria-label="Open menu"
    >
      <Menu className={styles.menuIcon} />
    </button>
  );
};

export default MobileMenuButton;
