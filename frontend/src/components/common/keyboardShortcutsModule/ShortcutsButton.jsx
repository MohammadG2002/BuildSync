import { Keyboard } from "lucide-react";

const ShortcutsButton = ({ onClick }) => {
  return (
    <button
      data-onboarding="shortcuts-button"
      onClick={onClick}
      className="fixed bottom-6 right-6 p-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40 group"
      title="Keyboard Shortcuts (Shift + ?)"
    >
      <Keyboard className="w-6 h-6" />
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Shortcuts (Shift + ?)
      </span>
    </button>
  );
};

export default ShortcutsButton;
