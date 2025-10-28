import Button from "../../common/Button";

const WorkspaceFormActions = ({ onCancel, loading, isEdit }) => {
  return (
    <div className="flex gap-3 justify-end pt-4">
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" loading={loading}>
        {isEdit ? "Update" : "Create"} Workspace
      </Button>
    </div>
  );
};

export default WorkspaceFormActions;
