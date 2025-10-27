import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import FileUpload from "../common/FileUpload";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import { Paperclip } from "lucide-react";

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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...formData, files });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          name="description"
          rows="4"
          placeholder="Add more details about this task..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            {Object.entries(TASK_STATUS).map(([key, value]) => (
              <option key={value} value={value}>
                {key.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            {Object.entries(TASK_PRIORITY).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assign To
          </label>
          <select
            name="assigneeId"
            value={formData.assigneeId}
            onChange={handleChange}
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
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      {/* File Attachments */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Attachments (Optional)
          </label>
          <button
            type="button"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Paperclip className="w-4 h-4" />
            {showFileUpload ? "Hide" : "Add Attachments"}
          </button>
        </div>

        {showFileUpload && (
          <FileUpload onFilesSelected={setFiles} maxFiles={5} maxSize={10} />
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {task ? "Update" : "Create"} Task
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
