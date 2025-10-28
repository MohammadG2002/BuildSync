import { User, Mail, Save } from "lucide-react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const ProfileForm = ({
  profileData,
  profileErrors,
  loading,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="John Doe"
        value={profileData.name}
        onChange={onChange}
        error={profileErrors.name}
        icon={User}
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={profileData.email}
        onChange={onChange}
        error={profileErrors.email}
        icon={Mail}
      />

      <Input
        label="Phone Number (Optional)"
        type="tel"
        name="phone"
        placeholder="+1 (555) 000-0000"
        value={profileData.phone}
        onChange={onChange}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Bio (Optional)
        </label>
        <textarea
          name="bio"
          rows="4"
          placeholder="Tell us about yourself..."
          value={profileData.bio}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
        />
      </div>

      <div className="flex justify-end pt-4">
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
  );
};

export default ProfileForm;
