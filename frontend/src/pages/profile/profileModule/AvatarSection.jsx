import { Camera } from "lucide-react";
import Button from "../../../components/common/Button";
import { getInitials, generateColor } from "../../../utils/helpers";

const AvatarSection = ({ userName, userEmail, onAvatarUpload }) => {
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
          style={{ backgroundColor: generateColor(userName || "User") }}
        >
          {getInitials(userName || "User")}
        </div>
        <button
          onClick={onAvatarUpload}
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {userName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
          {userEmail}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onAvatarUpload}
          className="mt-2 gap-2"
        >
          <Camera className="w-4 h-4" />
          Change Avatar
        </Button>
      </div>
    </div>
  );
};

export default AvatarSection;
