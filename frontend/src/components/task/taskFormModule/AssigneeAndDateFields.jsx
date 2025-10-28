import Input from "../../common/Input";

const AssigneeAndDateFields = ({ assigneeId, dueDate, onChange, members }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Assign To
        </label>
        <select
          name="assigneeId"
          value={assigneeId}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
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
