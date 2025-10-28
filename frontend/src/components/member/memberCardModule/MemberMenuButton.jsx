import { MoreVertical } from "lucide-react";

const MemberMenuButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    </button>
  );
};

export default MemberMenuButton;
