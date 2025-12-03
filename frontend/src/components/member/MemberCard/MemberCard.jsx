import { useState, useRef, useEffect } from "react";
import {
  MemberAvatar,
  MemberInfo,
  MemberRoleBadge,
  MemberMenuButton,
  MemberDropdownMenu,
  MemberJoinDate,
} from ".";
import styles from "./MemberCard.module.css";

const MemberCard = ({
  member,
  currentUserId,
  currentUserRole,
  onChangeRole,
  onRemove,
  onTransferOwnership,
}) => {
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

  const canOpenMenu =
    currentUserRole === "owner" || currentUserRole === "admin";

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <MemberAvatar member={member} />
          <MemberInfo member={member} isCurrentUser={isCurrentUser} />
        </div>

        {/* Role Badge and Menu */}
        <div className={styles.cardRight}>
          <MemberRoleBadge role={member.role} />

          {!isCurrentUser && canOpenMenu && (
            <div className={styles.menuContainer} ref={menuRef}>
              <MemberMenuButton onClick={() => setShowMenu(!showMenu)} />

              {showMenu && (
                <MemberDropdownMenu
                  member={member}
                  currentUserRole={currentUserRole}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                  onTransferOwnership={onTransferOwnership}
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
