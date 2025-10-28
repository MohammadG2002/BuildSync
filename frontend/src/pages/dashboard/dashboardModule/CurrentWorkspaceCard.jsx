import Button from "../../../components/common/Button";
import { Briefcase, ArrowRight } from "lucide-react";

const CurrentWorkspaceCard = ({ workspace, onSwitch }) => {
  if (!workspace) return null;

  return (
    <div>
      <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {workspace.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 truncate">
            {workspace.memberCount || 0} members
          </p>
        </div>
      </div>
      <Button variant="ghost" className="w-full mt-3 gap-2" onClick={onSwitch}>
        Switch Workspace
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CurrentWorkspaceCard;
