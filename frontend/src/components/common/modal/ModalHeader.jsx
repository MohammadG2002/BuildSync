import { X } from "lucide-react";

const ModalHeader = ({ title, showCloseButton, onClose }) => {
  if (!title && !showCloseButton) return null;

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
      {title && (
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 pr-2">
          {title}
        </h2>
      )}
      {showCloseButton && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default ModalHeader;
