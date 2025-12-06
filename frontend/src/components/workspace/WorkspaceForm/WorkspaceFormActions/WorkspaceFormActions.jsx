import Button from "../../../common/button/Button/Button";
import styles from "./WorkspaceFormActions.module.css";

const WorkspaceFormActions = ({ onCancel, loading, isEdit }) => {
  return (
    <div className={styles.actions}>
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
