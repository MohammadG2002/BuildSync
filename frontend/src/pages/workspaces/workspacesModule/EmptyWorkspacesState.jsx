import { Plus, Briefcase } from "lucide-react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

const EmptyWorkspacesState = ({ onCreateWorkspace }) => {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Briefcase className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No workspaces yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">
        Create your first workspace to get started with your projects
      </p>
      <Button variant="primary" onClick={onCreateWorkspace} className="gap-2">
        <Plus className="w-5 h-5" />
        Create Workspace
      </Button>
    </Card>
  );
};

export default EmptyWorkspacesState;
