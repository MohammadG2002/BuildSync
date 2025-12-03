import KeyBadge from "./KeyBadge";
import styles from "./KeyboardShortcuts.module.css";

const ProTips = () => {
  return (
    <div className={styles.proTips}>
      <h4 className={styles.proTipsTitle}>💡 Pro Tips</h4>
      <ul className={styles.proTipsList}>
        <li>
          • Most shortcuts work globally, even when not focused on an input
        </li>
        <li>
          • Press <KeyBadge keyText="Esc" /> to close any modal or cancel an
          action
        </li>
        <li>
          • Use <KeyBadge keyText="Tab" /> to navigate between form fields
          quickly
        </li>
        <li>
          • Combine shortcuts like <KeyBadge keyText="G" /> then{" "}
          <KeyBadge keyText="D" /> for quick navigation
        </li>
      </ul>
    </div>
  );
};

export default ProTips;
