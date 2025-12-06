import roleIcons from "../../../../utils/member/roleIcons";
import styles from "./MemberRoleBadge.module.css";

const roleClasses = {
  owner: styles.roleOwner,
  admin: styles.roleAdmin,
  member: styles.roleMember,
  viewer: styles.roleViewer,
};

const MemberRoleBadge = ({ role }) => {
  const RoleIcon = roleIcons[role] || roleIcons.member;
  const roleClass = roleClasses[role] || styles.roleMember;

  return (
    <span className={`${styles.roleBadge} ${roleClass}`}>
      <RoleIcon className={styles.roleBadgeIcon} />
      {role}
    </span>
  );
};

export default MemberRoleBadge;
