import { useState } from "react";
import Input from "../common/Input";
import {
  validateTaskForm,
  DescriptionField,
  StatusAndPriorityFields,
  AssigneeAndDateFields,
  AttachmentsField,
  TaskFormActions,
} from "./taskFormModule";
import styles from "./taskFormModule/TaskForm.module.css";

const TaskForm = ({ task, onSubmit, onCancel, loading, members = [] }) => {
  // Transform task.assignedTo array to assigneeIds array
  const getAssigneeIds = () => {
    if (!task) return [];
    if (task.assigneeIds) return task.assigneeIds; // If already transformed
    if (task.assignedTo && Array.isArray(task.assignedTo)) {
      return task.assignedTo.map((user) => user._id || user.id || user);
    }
    return [];
  };

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    assigneeIds: getAssigneeIds(),
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateTaskForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...formData, files });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Task Title"
        type="text"
        name="title"
        placeholder="e.g., Design homepage mockup"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        autoFocus
      />

      <DescriptionField value={formData.description} onChange={handleChange} />

      <StatusAndPriorityFields
        status={formData.status}
        priority={formData.priority}
        onChange={handleChange}
      />

      <AssigneeAndDateFields
        assigneeIds={formData.assigneeIds}
        dueDate={formData.dueDate}
        onChange={handleChange}
        members={members}
      />

      <AttachmentsField
        showFileUpload={showFileUpload}
        onToggle={() => setShowFileUpload(!showFileUpload)}
        onFilesSelected={setFiles}
      />

      <TaskFormActions onCancel={onCancel} loading={loading} isEdit={!!task} />
    </form>
  );
};

export default TaskForm;
