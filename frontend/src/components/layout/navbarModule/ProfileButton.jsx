import { getInitials, generateColor } from "../../../utils/helpers";

const ProfileButton = ({ user, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
        style={{ backgroundColor: generateColor(user?.name || "User") }}
      >
        {getInitials(user?.name || "User")}
      </div>
    </button>
  );
};

export default ProfileButton;
