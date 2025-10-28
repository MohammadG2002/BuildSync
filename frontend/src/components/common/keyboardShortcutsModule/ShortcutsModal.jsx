import Modal from "../Modal";
import ShortcutSection from "./ShortcutSection";
import ProTips from "./ProTips";
import ShortcutsFooter from "./ShortcutsFooter";

const ShortcutsModal = ({ isOpen, onClose, shortcuts }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
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
