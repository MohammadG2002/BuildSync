import { useState } from "react";
import Input from "../../common/input/Input";
import TagDropdown from "../TagDropdown/TagDropdown";
import DependenciesPicker from "../DependenciesPicker/DependenciesPicker";
import {
  validateTaskForm,
  DescriptionField,
  StatusAndPriorityFields,
  AssigneeAndDateFields,
  AttachmentsField,
  TaskFormActions,
} from ".";
import styles from "./TaskForm.module.css";

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

  // Compute default due date as 7 days from today (YYYY-MM-DD)
  const getDefaultNextWeekDate = () => {
    try {
      const today = new Date();
      today.setDate(today.getDate() + 7);
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    } catch {
      return "";
    }
  };

  // Helper to get dependency due date if available
  const getDependencyDueDate = () => {
    if (
      task?.dependencies &&
      Array.isArray(task.dependencies) &&
      task.dependencies.length > 0
    ) {
      const dep = task.dependencies[0];
      // dep can be an object or id, try to get dueDate
      if (typeof dep === "object" && dep.dueDate) {
        return dep.dueDate.split("T")[0];
      }
    }
    return null;
  };

  const [formData, setFormData] = useState(() => {
    const dependencyDueDate = getDependencyDueDate();
    // Default times: start 08:00, due 00:00 (midnight)
    const defaultStartTime = "08:00";
    const defaultDueTime = "00:00";
    // Compute default times based on date selection
    let startDate = task?.startDate
      ? task.startDate.split("T")[0]
      : dependencyDueDate || new Date().toISOString().split("T")[0];
    let dueDate = task?.dueDate
      ? task.dueDate.split("T")[0]
      : getDefaultNextWeekDate();
    let startTime = defaultStartTime;
    let dueTime = defaultDueTime;
    if (task?.startDate && task.startDate.includes("T")) {
      startTime = task.startDate.split("T")[1]?.slice(0, 5) || defaultStartTime;
    }
    if (task?.dueDate && task.dueDate.includes("T")) {
      dueTime = task.dueDate.split("T")[1]?.slice(0, 5) || defaultDueTime;
    }
    // If same day, default to 08:00 -> 20:00
    if (startDate === dueDate) {
      startTime = "08:00";
      dueTime = "20:00";
    } else {
      // If different days, default to 08:00 -> 08:00
      startTime = "08:00";
      dueTime = "08:00";
    }
    return {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "todo",
      priority: task?.priority || "medium",
      assigneeIds: getAssigneeIds(),
      startDate,
      startTime,
      dueDate,
      dueTime,
      tags: Array.isArray(task?.tags) ? task.tags : [],
      dependencies: Array.isArray(task?.dependencies)
        ? task.dependencies.map((d) => d._id || d) // normalize to ids
        : [],
    };
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let next = { ...prev, [name]: value };
      // If dueDate is changed and matches startDate, set dueTime to 20:00
      if (name === "dueDate" && value === prev.startDate) {
        next.dueTime = "20:00";
      }
      return next;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTagsChange = (next) => {
    setFormData((prev) => ({ ...prev, tags: next }));
  };

  const [dateError, setDateError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if due date/time is before start date/time
    const startDT = new Date(`${formData.startDate}T${formData.startTime}`);
    const dueDT = new Date(`${formData.dueDate}T${formData.dueTime}`);
    if (dueDT < startDT) {
      setDateError("Due date/time cannot be earlier than start date/time.");
      return;
    } else {
      setDateError("");
    }

    const newErrors = validateTaskForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...formData, files });
  };

  // Calculate duration in dd / hh:mm format
  const getDurationString = () => {
    const startDT = new Date(`${formData.startDate}T${formData.startTime}`);
    const dueDT = new Date(`${formData.dueDate}T${formData.dueTime}`);
    if (isNaN(startDT.getTime()) || isNaN(dueDT.getTime())) return "";
    let ms = dueDT - startDT;
    if (ms < 0) return "";
    const totalMinutes = Math.floor(ms / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    let str = "";
    if (days > 0) str += `${days}d`;
    if (hours > 0 || minutes > 0) {
      if (str) str += " / ";
      str += `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
    return str || "0d / 00:00";
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {dateError && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 8,
          }}
        >
          <strong>Warning:</strong> {dateError}
        </div>
      )}
      <div style={{ marginBottom: 8, color: "#2563eb", fontWeight: 500 }}>
        Duration: {getDurationString()}
      </div>
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

      {/* Dependencies section before dates */}
      <DependenciesPicker
        workspaceId={
          typeof task?.workspace === "object"
            ? task.workspace._id
            : task?.workspace || window.__WS_ID
        }
        projectId={
          typeof task?.project === "object"
            ? task.project._id
            : task?.project || window.__PROJECT_ID
        }
        currentTaskId={task?._id}
        selected={formData.dependencies}
        onChange={(next, allTasks) => {
          // Find the first dependency's due date
          let newStart = formData.startDate;
          let newDue = formData.dueDate;
          if (
            Array.isArray(next) &&
            next.length > 0 &&
            Array.isArray(allTasks)
          ) {
            const depId = next[0];
            const depObj = allTasks.find((t) => (t._id || t.id) === depId);
            if (depObj && depObj.dueDate) {
              const depDue = depObj.dueDate.split("T")[0];
              newStart = depDue;
              // Optionally, set due date to 7 days after dependency due date
              const d = new Date(depDue);
              d.setDate(d.getDate() + 7);
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              newDue = `${y}-${m}-${dd}`;
            }
          }
          setFormData((prev) => ({
            ...prev,
            dependencies: next,
            startDate: newStart,
            dueDate: newDue,
          }));
        }}
      />

      <AssigneeAndDateFields
        assigneeIds={formData.assigneeIds}
        startDate={formData.startDate}
        startTime={formData.startTime}
        dueDate={formData.dueDate}
        dueTime={formData.dueTime}
        onChange={handleChange}
        members={members}
      />

      <TagDropdown
        selected={formData.tags}
        onChange={handleTagsChange}
        onOpenManager={() => {
          // Dispatch global event; consumer can open overlay at page level
          window.dispatchEvent(new CustomEvent("tags:openManager"));
        }}
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
