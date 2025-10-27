import MemberCard from "./MemberCard";

const MemberList = ({
  members,
  currentUserId,
  onChangeRole,
  onRemove,
  groupByRole = false,
}) => {
  if (!groupByRole) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserId={currentUserId}
            onChangeRole={onChangeRole}
            onRemove={onRemove}
          />
        ))}
      </div>
    );
  }

  // Group by role
  const grouped = {
    admin: members.filter((m) => m.role === "admin"),
    member: members.filter((m) => m.role === "member"),
    viewer: members.filter((m) => m.role === "viewer"),
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([role, roleMembers]) => {
        if (roleMembers.length === 0) return null;

        return (
          <div key={role}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              {role}s ({roleMembers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  currentUserId={currentUserId}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MemberList;
