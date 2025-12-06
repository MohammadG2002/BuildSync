import groupMembersByRole from "../../../utils/member/groupMembersByRole";
import MemberGrid from "./MemberGrid";
import MemberRoleGroup from "./MemberRoleGroup";
import styles from "./MemberList.module.css";

const MemberList = ({
  members,
  currentUserId,
  currentUserRole,
  onChangeRole,
  onRemove,
  onTransferOwnership,
  groupByRole = false,
}) => {
  if (!groupByRole) {
    return (
      <MemberGrid
        members={members}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onChangeRole={onChangeRole}
        onRemove={onRemove}
        onTransferOwnership={onTransferOwnership}
      />
    );
  }

  const grouped = groupMembersByRole(members);

  return (
    <div className={styles.listContainer}>
      {Object.entries(grouped).map(([role, roleMembers]) => (
        <MemberRoleGroup
          key={role}
          role={role}
          members={roleMembers}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onChangeRole={onChangeRole}
          onRemove={onRemove}
          onTransferOwnership={onTransferOwnership}
        />
      ))}
    </div>
  );
};

export default MemberList;
