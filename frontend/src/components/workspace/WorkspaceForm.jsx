import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          name="description"
          rows="3"
          placeholder="What is this workspace for?"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {workspace ? "Update" : "Create"} Workspace
        </Button>
      </div>
    </form>
  );
};

export default WorkspaceForm;
