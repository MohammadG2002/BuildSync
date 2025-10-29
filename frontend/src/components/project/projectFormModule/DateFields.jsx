import Input from "../../common/Input";
import styles from "./ProjectForm.module.css";

const DateFields = ({ startDate, dueDate, onChange, dueDateError }) => {
  return (
    <div className={styles.dateGrid}>
      <Input
        label="Start Date"
        type="date"
        name="startDate"
        value={startDate}
        onChange={onChange}
      />
      <Input
        label="Due Date"
        type="date"
        name="dueDate"
        value={dueDate}
        onChange={onChange}
        error={dueDateError}
      />
    </div>
  );
};

export default DateFields;
