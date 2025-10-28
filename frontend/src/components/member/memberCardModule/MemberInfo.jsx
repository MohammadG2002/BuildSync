import { Mail } from "lucide-react";

const MemberInfo = ({ member, isCurrentUser }) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
          {member.name}
        </h3>
        {isCurrentUser && (
          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs font-medium rounded">
            You
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Mail className="w-4 h-4" />
        <span className="truncate">{member.email}</span>
      </div>
    </div>
  );
};

export default MemberInfo;
