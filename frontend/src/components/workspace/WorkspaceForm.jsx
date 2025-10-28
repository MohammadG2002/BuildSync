import { useState } from "react";
import Input from "../common/Input";
import {
  validateWorkspaceForm,
  WorkspaceDescriptionField,
  WorkspaceFormActions,
} from "./workspaceFormModule";

const WorkspaceForm = ({ workspace, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
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

    const newErrors = validateWorkspaceForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Workspace Name"
        type="text"
        name="name"
        placeholder="e.g., Marketing Team"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        autoFocus
      />

      <WorkspaceDescriptionField
        value={formData.description}
        onChange={handleChange}
      />

      <WorkspaceFormActions
        onCancel={onCancel}
        loading={loading}
        isEdit={!!workspace}
      />
    </form>
  );
};

export default WorkspaceForm;
