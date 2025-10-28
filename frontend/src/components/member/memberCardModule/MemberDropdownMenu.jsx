import { Trash2 } from "lucide-react";
import { USER_ROLES } from "../../../utils/constants";
import roleIcons from "./roleIcons";

const MemberDropdownMenu = ({ member, onChangeRole, onRemove, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
      <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
        Change Role
      </div>
      {Object.entries(USER_ROLES).map(([key, value]) => {
        const RoleIcon = roleIcons[value];
        return (
          <button
            key={value}
            onClick={() => {
              onChangeRole(member, value);
              onClose();
            }}
            disabled={member.role === value}
            className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
              member.role === value
                ? "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <RoleIcon className="w-4 h-4" />
            <span>{key}</span>
          </button>
        );
      })}
      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
      <button
        onClick={() => {
          onRemove(member);
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-sm"
      >
        <Trash2 className="w-4 h-4" />
        <span>Remove</span>
      </button>
    </div>
  );
};

export default MemberDropdownMenu;
