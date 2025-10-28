import { X } from "lucide-react";

const CloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
  </button>
);

export default CloseButton;
