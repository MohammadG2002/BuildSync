import { CheckCircle, Plus } from "lucide-react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

const EmptyTasksState = ({ filterStatus, onCreateTask }) => {
  return (
    <Card className="text-center py-12">
      <CheckCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No tasks found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">
        {filterStatus === "all"
          ? "Create your first task to get started"
          : `No tasks with status: ${filterStatus.replace("_", " ")}`}
      </p>
      <Button variant="primary" onClick={onCreateTask} className="gap-2">
        <Plus className="w-5 h-5" />
        Create Task
      </Button>
    </Card>
  );
};

export default EmptyTasksState;
