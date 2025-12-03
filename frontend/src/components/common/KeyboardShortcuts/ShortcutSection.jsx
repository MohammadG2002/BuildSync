import { Command } from "lucide-react";
import KeyBadge from "./KeyBadge";
import styles from "./KeyboardShortcuts.module.css";

const ShortcutSection = ({ section }) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>
        <Command className={styles.sectionIcon} />
        {section.category}
      </h3>
      <div className={styles.sectionItems}>
        {section.items.map((item, itemIndex) => (
          <div key={itemIndex} className={styles.shortcutItem}>
            <span className={styles.shortcutDescription}>
              {item.description}
            </span>
            <div className={styles.shortcutKeys}>
              {item.keys.map((key, keyIndex) => (
                <span key={keyIndex} className={styles.shortcutKeys}>
                  <KeyBadge keyText={key} />
                  {keyIndex < item.keys.length - 1 && (
                    <span className={styles.keySeparator}>+</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortcutSection;
