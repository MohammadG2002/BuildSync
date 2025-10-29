import Input from "../../common/Input";
import styles from "./TaskForm.module.css";

const AssigneeAndDateFields = ({ assigneeId, dueDate, onChange, members }) => {
  return (
    <div className={styles.gridTwo}>
      <div>
        <label className={styles.fieldLabel}>Assign To</label>
        <select
          name="assigneeId"
          value={assigneeId}
          onChange={onChange}
          className={styles.select}
        >
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Due Date"
        type="date"
        name="dueDate"
        value={dueDate}
        onChange={onChange}
      />
    </div>
  );
};

export default AssigneeAndDateFields;
