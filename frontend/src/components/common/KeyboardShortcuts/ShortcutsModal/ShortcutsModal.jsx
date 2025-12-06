import Modal from "../../modal/Modal";
import ShortcutSection from "../ShortcutSection/ShortcutSection";
import ProTips from "../ProTips/ProTips";
import ShortcutsFooter from "../ShortcutsFooter/ShortcutsFooter";
import styles from "./ShortcutsModal.module.css";

const ShortcutsModal = ({ isOpen, onClose, shortcuts }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      size="lg"
    >
      <div className={styles.modalContent}>
        <p className={styles.modalDescription}>
          Use these keyboard shortcuts to navigate and perform actions quickly
          throughout the application.
        </p>

        {shortcuts.map((section, index) => (
          <ShortcutSection key={index} section={section} />
        ))}

        <ProTips />
        <ShortcutsFooter onClose={onClose} />
      </div>
    </Modal>
  );
};

export default ShortcutsModal;
