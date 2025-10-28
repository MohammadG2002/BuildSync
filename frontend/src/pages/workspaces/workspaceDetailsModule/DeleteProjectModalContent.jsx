import Button from "../../../components/common/Button";

const DeleteProjectModalContent = ({
  projectName,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
        Are you sure you want to delete <strong>{projectName}</strong>? This
        action cannot be undone and will delete all tasks within this project.
      </p>
      <div className="flex gap-3 justify-end pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Delete Project
        </Button>
      </div>
    </div>
  );
};

export default DeleteProjectModalContent;
