import styles from "./KeyBadge.module.css";

const KeyBadge = ({ keyText }) => (
  <kbd className={styles.keyBadge}>{keyText}</kbd>
);

export default KeyBadge;
