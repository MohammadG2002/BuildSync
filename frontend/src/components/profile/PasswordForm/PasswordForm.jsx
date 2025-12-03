import { Lock, Eye, EyeOff } from "lucide-react";
import Input from "../../common/input/Input";
import Button from "../../common/button/Button";
import styles from "./PasswordForm.module.css";

const PasswordForm = ({
  passwordData,
  passwordErrors,
  showPasswords,
  passwordStrength,
  loading,
  onChange,
  onSubmit,
  onTogglePassword,
}) => {
  const getStrengthBarClass = (level, barIndex) => {
    if (level === "weak" && barIndex === 1) return styles.strengthBarWeak;
    if (level === "medium" && barIndex <= 2) return styles.strengthBarMedium;
    if (level === "strong") return styles.strengthBarStrong;
    return styles.strengthBarInactive;
  };

  const getStrengthTextClass = (level) => {
    if (level === "weak") return styles.strengthTextWeak;
    if (level === "medium") return styles.strengthTextMedium;
    if (level === "strong") return styles.strengthTextStrong;
    return "";
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div style={{ position: "relative" }}>
        <Input
          label="Current Password"
          type={showPasswords.current ? "text" : "password"}
          name="currentPassword"
          placeholder="Enter current password"
          value={passwordData.currentPassword}
          onChange={onChange}
          error={passwordErrors.currentPassword}
          icon={Lock}
        />
        <button
          type="button"
          onClick={() => onTogglePassword("current")}
          className={styles.passwordToggle}
        >
          {showPasswords.current ? (
            <EyeOff className={styles.passwordIcon} />
          ) : (
            <Eye className={styles.passwordIcon} />
          )}
        </button>
      </div>

      <div style={{ position: "relative" }}>
        <Input
          label="New Password"
          type={showPasswords.new ? "text" : "password"}
          name="newPassword"
          placeholder="Enter new password"
          value={passwordData.newPassword}
          onChange={onChange}
          error={passwordErrors.newPassword}
          icon={Lock}
        />
        <button
          type="button"
          onClick={() => onTogglePassword("new")}
          className={styles.passwordToggle}
        >
          {showPasswords.new ? (
            <EyeOff className={styles.passwordIcon} />
          ) : (
            <Eye className={styles.passwordIcon} />
          )}
        </button>

        {/* Password Strength Indicator */}
        {passwordStrength && (
          <div className={styles.strengthIndicator}>
            <div className={styles.strengthBars}>
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`${styles.strengthBar} ${getStrengthBarClass(
                    passwordStrength.level,
                    index
                  )}`}
                ></div>
              ))}
            </div>
            <p
              className={`${styles.strengthText} ${getStrengthTextClass(
                passwordStrength.level
              )}`}
            >
              Password strength: {passwordStrength.level}
            </p>
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <Input
          label="Confirm New Password"
          type={showPasswords.confirm ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm new password"
          value={passwordData.confirmPassword}
          onChange={onChange}
          error={passwordErrors.confirmPassword}
          icon={Lock}
        />
        <button
          type="button"
          onClick={() => onTogglePassword("confirm")}
          className={styles.passwordToggle}
        >
          {showPasswords.confirm ? (
            <EyeOff className={styles.passwordIcon} />
          ) : (
            <Eye className={styles.passwordIcon} />
          )}
        </button>
      </div>

      <div className={styles.passwordRequirements}>
        <p className={styles.requirementsTitle}>
          <strong>Password requirements:</strong>
        </p>
        <ul className={styles.requirementsList}>
          <li>At least 8 characters long</li>
          <li>Contains uppercase and lowercase letters</li>
          <li>Contains at least one number</li>
        </ul>
      </div>

      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className={styles.passwordChangeButton}
        >
          <Lock className={styles.passwordChangeIcon} />
          Change Password
        </Button>
      </div>
    </form>
  );
};

export default PasswordForm;
