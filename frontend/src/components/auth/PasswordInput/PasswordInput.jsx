import { Eye, EyeOff } from "lucide-react";
import Input from "../../common/input/Input/Input";
import styles from "./PasswordInput.module.css";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  error,
  icon,
  placeholder,
  autoComplete,
  showPassword,
  onTogglePassword,
  showStrength = false,
  passwordStrength = null,
}) => {
  return (
    <div className={styles.container}>
      <Input
        label={label}
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        icon={icon}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className={styles.toggleButton}
      >
        {showPassword ? (
          <EyeOff className={styles.toggleIcon} />
        ) : (
          <Eye className={styles.toggleIcon} />
        )}
      </button>

      {/* Password Strength Indicator */}
      {showStrength && passwordStrength && (
        <div className={styles.strengthIndicator}>
          <div className={styles.strengthBars}>
            <div
              className={`${styles.strengthBar} ${
                passwordStrength.level === "weak"
                  ? styles.barWeak
                  : passwordStrength.level === "medium"
                  ? styles.barMedium
                  : styles.barStrong
              }`}
            ></div>
            <div
              className={`${styles.strengthBar} ${
                passwordStrength.level === "medium"
                  ? styles.barMedium
                  : passwordStrength.level === "strong"
                  ? styles.barStrong
                  : styles.barInactive
              }`}
            ></div>
            <div
              className={`${styles.strengthBar} ${
                passwordStrength.level === "strong"
                  ? styles.barStrong
                  : styles.barInactive
              }`}
            ></div>
          </div>
          <p
            className={`${styles.strengthText} ${
              passwordStrength.level === "weak"
                ? styles.textWeak
                : passwordStrength.level === "medium"
                ? styles.textMedium
                : styles.textStrong
            }`}
          >
            Password strength: {passwordStrength.level}
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
