import { User, Mail, Save } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import styles from "./Profile.module.css";

const ProfileForm = ({
  profileData,
  profileErrors,
  loading,
  onChange,
  onSubmit,
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
        <label className={styles.bioLabel}>Bio (Optional)</label>
        <textarea
          name="bio"
          rows="4"
          placeholder="Tell us about yourself..."
          value={profileData.bio}
          onChange={onChange}
          className={styles.bioTextarea}
        />
      </div>

      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className={styles.formSaveButton}
        >
          <Save className={styles.formSaveIcon} />
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
