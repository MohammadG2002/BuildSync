import { useState } from "react";
import Input from "../../../common/input/Input/Input";
import { validateWorkspaceForm as validateForm } from "../../../../utils/workspace/validateWorkspaceForm";
import DescriptionField from "../../../common/form/DescriptionField/DescriptionField";
import FormActions from "../../../common/form/FormActions/FormActions";
import styles from "./WorkspaceForm.module.css";

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
    <form onSubmit={handleSubmit} className={styles.form}>
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

      <DescriptionField
        value={formData.description}
        onChange={handleChange}
        rows={3}
        placeholder="What is this workspace for?"
      />

      <FormActions
        onCancel={onCancel}
        loading={loading}
        isEdit={!!workspace}
        entityName="Workspace"
      />
    </form>
  );
};

export default WorkspaceForm;
