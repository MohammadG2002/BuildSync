import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

const DangerZone = ({ onDeleteClick }) => {
  return (
    <Card>
      <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Deleting this workspace is permanent and cannot be undone. All
              projects, tasks, and data will be permanently deleted.
            </p>
            <Button variant="danger" onClick={onDeleteClick} className="gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Workspace
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DangerZone;
