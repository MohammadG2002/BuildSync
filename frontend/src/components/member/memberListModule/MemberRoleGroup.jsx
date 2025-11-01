import MemberGrid from "./MemberGrid";
import styles from "../memberCardModule/MemberCard.module.css";

const MemberRoleGroup = ({
  role,
  members,
  currentUserId,
  currentUserRole,
  onChangeRole,
  onRemove,
}) => {
  if (members.length === 0) return null;

  return (
    <div className={styles.roleGroup}>
      <h3 className={styles.roleGroupHeader}>
        {role}s ({members.length})
      </h3>
      <MemberGrid
        members={members}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onChangeRole={onChangeRole}
        onRemove={onRemove}
      />
    </div>
  );
};

export default MemberRoleGroup;
