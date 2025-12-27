import { User, Mail, Save } from "lucide-react";
import Input from "../../common/input/Input/Input";
import Button from "../../common/button/Button/Button";
import styles from "./ProfileForm.module.css";

const ProfileForm = ({
  profileData,
  profileErrors,
  loading,
  onChange,
  onSubmit,
  editable = true,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="John Doe"
        value={profileData.name}
        onChange={onChange}
        readOnly={!editable}
        disabled={!editable}
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
        readOnly={!editable}
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
        readOnly={!editable}
        disabled={!editable}
      />

      <div>
        <label className={styles.bioLabel}>Bio (Optional)</label>
        <textarea
          name="bio"
          rows="4"
          placeholder="Tell us about yourself..."
          value={profileData.bio}
          onChange={onChange}
          className={styles.bioTextarea}
          readOnly={!editable}
          disabled={!editable}
        />
      </div>

      <div className={styles.formActions}>
        {editable && (
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className={styles.formSaveButton}
          >
            <Save className={styles.formSaveIcon} />
            Save Changes
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
