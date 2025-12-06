import KeyBadge from "../KeyBadge/KeyBadge";
import styles from "./ShortcutsFooter.module.css";

const ShortcutsFooter = ({ onClose }) => {
  return (
    <div className={styles.footer}>
      <button onClick={onClose} className={styles.footerButton}>
        Press <KeyBadge keyText="Esc" /> to close
      </button>
    </div>
  );
};

export default ShortcutsFooter;
