import { useState } from "react";
import Input from "../../common/input/Input/Input";
import { validateForm } from "../../../utils/project/validateForm";
import DescriptionField from "./DescriptionField/DescriptionField";
import StatusField from "./StatusField/StatusField";
import DateFields from "./DateFields/DateFields";
import FormActions from "./FormActions/FormActions";
import styles from "./ProjectForm.module.css";

const ProjectForm = ({ project, onSubmit, onCancel, loading }) => {
  // Normalize various incoming date formats to HTML date input format (YYYY-MM-DD)
  const toInputDate = (val) => {
    if (!val) return "";
    try {
      if (typeof val === "string") {
        const s = val.trim();
        // Already ISO date string
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        // If full ISO datetime
        if (s.includes("T")) return s.split("T")[0];
        // dd-mm-yyyy
        const dmY = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dmY) {
          const [, d, m, y] = dmY;
          return `${y}-${m}-${d}`;
        }
        // dd/mm/yyyy
        const dmYslash = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (dmYslash) {
          const [, d, m, y] = dmYslash;
          return `${y}-${m}-${d}`;
        }
      }
      // Date object or timestamp
      const date = new Date(val);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      if (!isNaN(y) && !isNaN(date.getTime())) {
        return `${y}-${m}-${d}`;
      }
      return "";
    } catch {
      return "";
    }
  };

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "planning",
    startDate:
      toInputDate(project?.startDate) || today.toISOString().split("T")[0],
    dueDate:
      toInputDate(project?.dueDate) || nextMonth.toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Project Name"
        type="text"
        name="name"
        placeholder="e.g., Website Redesign"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        autoFocus
      />

      <DescriptionField value={formData.description} onChange={handleChange} />

      <StatusField value={formData.status} onChange={handleChange} />

      <DateFields
        startDate={formData.startDate}
        dueDate={formData.dueDate}
        onChange={handleChange}
        dueDateError={errors.dueDate}
      />

      <FormActions onCancel={onCancel} loading={loading} isEdit={!!project} />
    </form>
  );
};

export default ProjectForm;
