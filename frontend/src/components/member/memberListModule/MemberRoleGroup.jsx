import MemberGrid from "./MemberGrid";

const MemberRoleGroup = ({
  role,
  members,
  currentUserId,
  onChangeRole,
  onRemove,
}) => {
  if (members.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
        {role}s ({members.length})
      </h3>
      <MemberGrid
        members={members}
        currentUserId={currentUserId}
        onChangeRole={onChangeRole}
        onRemove={onRemove}
      />
    </div>
  );
};

export default MemberRoleGroup;
