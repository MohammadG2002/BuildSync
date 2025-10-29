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
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    assigneeId: task?.assigneeId || "",
    dueDate: task?.dueDate || "",
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
        assigneeId={formData.assigneeId}
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
