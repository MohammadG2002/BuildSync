import KeyBadge from "./KeyBadge";

const ShortcutsFooter = ({ onClose }) => {
  return (
    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onClose}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        Press <KeyBadge keyText="Esc" /> to close
      </button>
    </div>
  );
};

export default ShortcutsFooter;
