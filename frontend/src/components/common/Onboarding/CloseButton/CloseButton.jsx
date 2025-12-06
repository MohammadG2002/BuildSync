import { X } from "lucide-react";
import styles from "./CloseButton.module.css";

const CloseButton = ({ onClick }) => (
  <button onClick={onClick} className={styles.closeButton}>
    <X className={styles.closeIcon} />
  </button>
);

export default CloseButton;
