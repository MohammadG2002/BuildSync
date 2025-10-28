import { useState } from "react";
import Input from "../common/Input";
import {
  validateForm,
  DescriptionField,
  StatusField,
  DateFields,
  FormActions,
} from "./projectFormModule";

const ProjectForm = ({ project, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "planning",
    startDate: project?.startDate || "",
    dueDate: project?.dueDate || "",
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
    <form onSubmit={handleSubmit} className="space-y-5">
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
