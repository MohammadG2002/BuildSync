import Button from "../../common/Button";

const FormActions = ({ onCancel, loading, isEdit }) => {
  return (
    <div className="flex gap-3 justify-end pt-4">
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" loading={loading}>
        {isEdit ? "Update" : "Create"} Project
      </Button>
    </div>
  );
};

export default FormActions;
