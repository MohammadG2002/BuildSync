import { X } from "lucide-react";

const NotificationDeleteButton = ({ onDelete }) => {
  return (
    <button
      onClick={onDelete}
      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
    </button>
  );
};

export default NotificationDeleteButton;
