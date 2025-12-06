import { X } from "lucide-react";
import styles from "./ModalHeader.module.css";

const ModalHeader = ({ title, showCloseButton, onClose }) => {
  if (!title && !showCloseButton) return null;

  return (
    <div className={styles.header}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {showCloseButton && (
        <button onClick={onClose} className={styles.closeButton}>
          <X className={styles.closeIcon} />
        </button>
      )}
    </div>
  );
};

export default ModalHeader;
