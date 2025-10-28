import { useState, useRef, useEffect } from "react";
import {
  MemberAvatar,
  MemberInfo,
  MemberRoleBadge,
  MemberMenuButton,
  MemberDropdownMenu,
  MemberJoinDate,
} from "./memberCardModule";

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <MemberAvatar name={member.name} />
          <MemberInfo member={member} isCurrentUser={isCurrentUser} />
        </div>

        {/* Role Badge and Menu */}
        <div className="flex items-center gap-2">
          <MemberRoleBadge role={member.role} />

          {!isCurrentUser && (
            <div className="relative" ref={menuRef}>
              <MemberMenuButton onClick={() => setShowMenu(!showMenu)} />

              {showMenu && (
                <MemberDropdownMenu
                  member={member}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                  onClose={() => setShowMenu(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <MemberJoinDate joinedDate={member.joinedDate} />
    </div>
  );
};

export default MemberCard;
