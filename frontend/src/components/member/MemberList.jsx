import {
  groupMembersByRole,
  MemberGrid,
  MemberRoleGroup,
} from "./memberListModule";

const MemberList = ({
  members,
  currentUserId,
  onChangeRole,
  onRemove,
  groupByRole = false,
}) => {
  if (!groupByRole) {
    return (
      <MemberGrid
        members={members}
        currentUserId={currentUserId}
        onChangeRole={onChangeRole}
        onRemove={onRemove}
      />
    );
  }

  const grouped = groupMembersByRole(members);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([role, roleMembers]) => (
        <MemberRoleGroup
          key={role}
          role={role}
          members={roleMembers}
          currentUserId={currentUserId}
          onChangeRole={onChangeRole}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default MemberList;
