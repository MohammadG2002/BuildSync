import { TASK_STATUS, TASK_PRIORITY } from "../../../utils/constants";
import styles from "./TaskForm.module.css";

const StatusAndPriorityFields = ({ status, priority, onChange }) => {
  return (
    <div className={styles.gridTwo}>
      <div>
        <label className={styles.fieldLabel}>Status</label>
        <select
          name="status"
          value={status}
          onChange={onChange}
          className={styles.select}
        >
          {Object.entries(TASK_STATUS).map(([key, value]) => (
            <option key={value} value={value}>
              {key.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={styles.fieldLabel}>Priority</label>
        <select
          name="priority"
          value={priority}
          onChange={onChange}
          className={styles.select}
        >
          {Object.entries(TASK_PRIORITY).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StatusAndPriorityFields;
