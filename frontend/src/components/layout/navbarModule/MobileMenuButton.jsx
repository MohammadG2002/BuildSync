import { Menu } from "lucide-react";

const MobileMenuButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </button>
  );
};

export default MobileMenuButton;
