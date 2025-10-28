import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

const WorkspaceNotFoundState = ({ onBackClick }) => {
  return (
    <div className="space-y-6">
      <Card className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Workspace not found
        </h3>
        <Button variant="primary" onClick={onBackClick}>
          Back to Workspaces
        </Button>
      </Card>
    </div>
  );
};

export default WorkspaceNotFoundState;
