import { PROJECT_STATUS } from "../../../utils/constants";
import styles from "./ProjectForm.module.css";

const StatusField = ({ value, onChange }) => {
  return (
    <div>
      <label className={styles.label}>Status</label>
      <select
        name="status"
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        {Object.entries(PROJECT_STATUS).map(([key, value]) => (
          <option key={value} value={value}>
            {key.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusField;
