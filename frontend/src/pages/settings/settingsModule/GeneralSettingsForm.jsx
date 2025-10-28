import { Save } from "lucide-react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";

const GeneralSettingsForm = ({
  formData,
  errors,
  loading,
  onChange,
  onSubmit,
}) => {
  return (
    <Card title="General Settings">
      <form onSubmit={onSubmit} className="space-y-5">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            placeholder="What is this workspace for?"
            value={formData.description}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex justify-end">
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
