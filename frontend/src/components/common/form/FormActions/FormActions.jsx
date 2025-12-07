import Button from "../../button/Button/Button";
import styles from "./FormActions.module.css";

const FormActions = ({ onCancel, loading, isEdit, entityName = "Item" }) => {
  return (
    <div className={styles.actions}>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" loading={loading}>
        {isEdit ? "Update" : "Create"} {entityName}
      </Button>
    </div>
  );
};

export default FormActions;
