import { Keyboard } from "lucide-react";
import styles from "./KeyboardShortcuts.module.css";

const ShortcutsButton = ({ onClick }) => {
  return (
    <button
      data-onboarding="shortcuts-button"
      onClick={onClick}
      className={styles.shortcutsButton}
      title="Keyboard Shortcuts (Shift + ?)"
    >
      <Keyboard className={styles.shortcutsIcon} />
      <span className={styles.shortcutsTooltip}>Shortcuts (Shift + ?)</span>
    </button>
  );
};

export default ShortcutsButton;
