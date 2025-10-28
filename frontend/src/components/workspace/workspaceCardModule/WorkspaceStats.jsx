import { Users, FolderKanban } from "lucide-react";

const WorkspaceStats = ({ workspace }) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span>{workspace.memberCount || 0} members</span>
      </div>
      <div className="flex items-center gap-1">
        <FolderKanban className="w-4 h-4" />
        <span>{workspace.projectCount || 0} projects</span>
      </div>
    </div>
  );
};

export default WorkspaceStats;
