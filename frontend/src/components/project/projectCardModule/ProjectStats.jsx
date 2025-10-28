import { CheckCircle, Users } from "lucide-react";

const ProjectStats = ({ project }) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <CheckCircle className="w-4 h-4" />
        <span>
          {project.completedTasks || 0}/{project.totalTasks || 0} tasks
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span>{project.memberCount || 0} members</span>
      </div>
    </div>
  );
};

export default ProjectStats;
