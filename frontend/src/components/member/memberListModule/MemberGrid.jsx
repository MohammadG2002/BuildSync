import MemberCard from "../MemberCard";

const MemberGrid = ({ members, currentUserId, onChangeRole, onRemove }) => {
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
};

export default MemberGrid;
