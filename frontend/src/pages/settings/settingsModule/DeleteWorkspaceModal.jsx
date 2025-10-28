import { AlertTriangle } from "lucide-react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";

const DeleteWorkspaceModal = ({
  isOpen,
  workspaceName,
  deleteConfirmation,
  loading,
  onClose,
  onConfirmationChange,
  onDelete,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Workspace" size="md">
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-900 mb-1">
                This action cannot be undone
              </h4>
              <p className="text-sm text-red-700">
                This will permanently delete the{" "}
                <strong>{workspaceName}</strong> workspace, including all
                projects, tasks, and member access.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Please type <strong>{workspaceName}</strong> to confirm deletion:
          </p>
          <Input
            type="text"
            placeholder={workspaceName}
            value={deleteConfirmation}
            onChange={onConfirmationChange}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            loading={loading}
            disabled={deleteConfirmation !== workspaceName}
          >
            Delete Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
