import { Calendar } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {project.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
            {project.workspace}
          </p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {project.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
            Progress
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Members and Due Date */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.map((member) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              style={{
                backgroundColor: generateColor(member.name),
              }}
              title={member.name}
            >
              {getInitials(member.name)}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Due {formatDate(project.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
