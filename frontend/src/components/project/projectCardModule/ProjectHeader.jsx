import { FolderKanban } from "lucide-react";
import statusColors from "./statusColors";

const ProjectHeader = ({ project }) => {
  return (
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
        <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate pr-8">
            {project.name}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {project.description || "No description"}
        </p>
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            statusColors[project.status]
          }`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
};

export default ProjectHeader;
