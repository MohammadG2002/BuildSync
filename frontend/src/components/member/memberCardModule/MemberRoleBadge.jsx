import roleIcons from "./roleIcons";
import roleColors from "./roleColors";

const MemberRoleBadge = ({ role }) => {
  const RoleIcon = roleIcons[role] || roleIcons.member;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${roleColors[role]}`}
    >
      <RoleIcon className="w-3 h-3" />
      {role}
    </span>
  );
};

export default MemberRoleBadge;
