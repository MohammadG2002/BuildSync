import {
  MoreVertical,
  Mail,
  Shield,
  User,
  Crown,
  Eye,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getInitials, generateColor } from "../../utils/helpers";
import { USER_ROLES } from "../../utils/constants";

const MemberCard = ({ member, currentUserId, onChangeRole, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCurrentUser = member.id === currentUserId;

  const roleIcons = {
    admin: Crown,
    member: User,
    viewer: Eye,
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-700",
    member: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-700",
  };

  const RoleIcon = roleIcons[member.role] || User;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0"
            style={{ backgroundColor: generateColor(member.name) }}
          >
            {getInitials(member.name)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {member.name}
              </h3>
              {isCurrentUser && (
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        </div>

        {/* Role Badge and Menu */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              roleColors[member.role]
            }`}
          >
            <RoleIcon className="w-3 h-3" />
            {member.role}
          </span>

          {!isCurrentUser && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Change Role
                  </div>
                  {Object.entries(USER_ROLES).map(([key, value]) => (
                    <button
                      key={value}
                      onClick={() => {
                        onChangeRole(member, value);
                        setShowMenu(false);
                      }}
                      disabled={member.role === value}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                        member.role === value
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {React.createElement(roleIcons[value], {
                        className: "w-4 h-4",
                      })}
                      <span>{key}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      onRemove(member);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {member.joinedDate && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          Joined{" "}
          {new Date(member.joinedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      )}
    </div>
  );
};

export default MemberCard;
