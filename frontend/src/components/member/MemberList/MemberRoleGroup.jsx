import MemberGrid from "./MemberGrid";
import styles from "../MemberCard/MemberCard.module.css";

const MemberRoleGroup = ({
  role,
  members,
  currentUserId,
  currentUserRole,
  onChangeRole,
  onRemove,
  onTransferOwnership,
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
        onTransferOwnership={onTransferOwnership}
      />
    </div>
  );
};

export default MemberRoleGroup;
