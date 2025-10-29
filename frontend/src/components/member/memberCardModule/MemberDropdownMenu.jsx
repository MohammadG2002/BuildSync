import { Trash2 } from "lucide-react";
import { USER_ROLES } from "../../../utils/constants";
import roleIcons from "./roleIcons";
import styles from "./MemberCard.module.css";

const MemberDropdownMenu = ({ member, onChangeRole, onRemove, onClose }) => {
  return (
    <div className={styles.dropdownMenu}>
      <div className={styles.dropdownHeader}>Change Role</div>
      {Object.entries(USER_ROLES).map(([key, value]) => {
        const RoleIcon = roleIcons[value];
        const isDisabled = member.role === value;
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
      <button
        onClick={() => {
          onRemove(member);
          onClose();
        }}
        className={styles.dropdownItemDelete}
      >
        <Trash2 className={styles.dropdownItemIcon} />
        <span>Remove</span>
      </button>
    </div>
  );
};

export default MemberDropdownMenu;
