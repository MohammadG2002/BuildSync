import { Trash2 } from "lucide-react";
import { USER_ROLES } from "../../../utils/constants";
import roleIcons from "../../../utils/member/roleIcons";
import styles from "./MemberCard.module.css";

const MemberDropdownMenu = ({
  member,
  currentUserRole,
  onChangeRole,
  onRemove,
  onClose,
}) => {
  return (
    <div className={styles.dropdownMenu}>
      <div className={styles.dropdownHeader}>Change Role</div>
      {Object.entries(USER_ROLES).map(([key, value]) => {
        const RoleIcon = roleIcons[value];
        const isSameRole = member.role === value;
        // Permission rules:
        // - No one can change the owner's role
        // - Admins can change roles of members/viewers but cannot change admins and cannot assign admin role
        // - Members/viewers cannot change any roles
        let blocked = false;
        if (member.role === "owner") {
          blocked = true;
        } else if (
          currentUserRole === "member" ||
          currentUserRole === "viewer" ||
          !currentUserRole
        ) {
          blocked = true;
        } else if (currentUserRole === "admin") {
          if (member.role === "admin") {
            blocked = true;
          } else if (value === "admin") {
            blocked = true;
          }
        }
        const isDisabled = isSameRole || blocked;
        const buttonClass = isDisabled
          ? `${styles.dropdownItem} ${styles.dropdownItemDisabled}`
          : styles.dropdownItem;

        return (
          <button
            key={value}
            onClick={() => {
              onChangeRole(member, value);
              onClose();
            }}
            disabled={isDisabled}
            className={buttonClass}
          >
            <RoleIcon className={styles.dropdownItemIcon} />
            <span>{key}</span>
          </button>
        );
      })}
      <div className={styles.dropdownDivider}></div>
      {(() => {
        // Removal permissions
        // - No one can remove the owner
        // - Admins can remove members/viewers but cannot remove admins
        // - Members/viewers cannot remove anyone
        let canRemove = true;
        if (member.role === "owner") {
          canRemove = false;
        } else if (
          currentUserRole === "member" ||
          currentUserRole === "viewer" ||
          !currentUserRole
        ) {
          canRemove = false;
        } else if (currentUserRole === "admin") {
          if (member.role === "admin") canRemove = false;
        }
        return (
          <button
            onClick={() => {
              if (!canRemove) return;
              onRemove(member);
              onClose();
            }}
            disabled={!canRemove}
            className={styles.dropdownItemDelete}
            title={
              !canRemove
                ? "You don't have permission to remove this member"
                : undefined
            }
          >
            <Trash2 className={styles.dropdownItemIcon} />
            <span>Remove</span>
          </button>
        );
      })()}
    </div>
  );
};

export default MemberDropdownMenu;
