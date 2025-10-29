import { useState, useRef, useEffect } from "react";
import {
  MemberAvatar,
  MemberInfo,
  MemberRoleBadge,
  MemberMenuButton,
  MemberDropdownMenu,
  MemberJoinDate,
} from "./memberCardModule";
import styles from "./memberCardModule/MemberCard.module.css";

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
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <MemberAvatar name={member.name} />
          <MemberInfo member={member} isCurrentUser={isCurrentUser} />
        </div>

        {/* Role Badge and Menu */}
        <div className={styles.cardRight}>
          <MemberRoleBadge role={member.role} />

          {!isCurrentUser && (
            <div className={styles.menuContainer} ref={menuRef}>
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
