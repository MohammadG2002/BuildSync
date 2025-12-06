import Button from "../../../common/button/Button/Button";
import styles from "./TaskFormActions.module.css";

const TaskFormActions = ({ onCancel, loading, isEdit }) => {
  return (
    <div className={styles.actions}>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" loading={loading}>
        {isEdit ? "Update" : "Create"} Task
      </Button>
    </div>
  );
};

export default TaskFormActions;
