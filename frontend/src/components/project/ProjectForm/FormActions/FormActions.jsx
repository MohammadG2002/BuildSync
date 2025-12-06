import Button from "../../../common/button/Button/Button";
import styles from "./FormActions.module.css";

const FormActions = ({ onCancel, loading, isEdit }) => {
  return (
    <div className={styles.actions}>
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
