import { Save } from "lucide-react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import styles from "./Settings.module.css";

const GeneralSettingsForm = ({
  formData,
  errors,
  loading,
  onChange,
  onSubmit,
}) => {
  return (
    <Card title="General Settings">
      <form onSubmit={onSubmit} className={styles.form}>
        <Input
          label="Workspace Name"
          type="text"
          name="name"
          placeholder="e.g., Marketing Team"
          value={formData.name}
          onChange={onChange}
          error={errors.name}
        />

        <div>
          <label className={styles.descriptionLabel}>Description</label>
          <textarea
            name="description"
            rows="3"
            placeholder="What is this workspace for?"
            value={formData.description}
            onChange={onChange}
            className={styles.descriptionTextarea}
          />
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default GeneralSettingsForm;
