import { Eye, EyeOff } from "lucide-react";
import Input from "../../../components/common/Input";

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
    <div className="relative">
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
        className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>

      {/* Password Strength Indicator */}
      {showStrength && passwordStrength && (
        <div className="mt-2">
          <div className="flex gap-1">
            <div
              className={`h-1 flex-1 rounded ${
                passwordStrength.level === "weak"
                  ? "bg-red-500"
                  : passwordStrength.level === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            ></div>
            <div
              className={`h-1 flex-1 rounded ${
                passwordStrength.level === "medium"
                  ? "bg-yellow-500"
                  : passwordStrength.level === "strong"
                  ? "bg-green-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
            <div
              className={`h-1 flex-1 rounded ${
                passwordStrength.level === "strong"
                  ? "bg-green-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          </div>
          <p
            className={`text-xs mt-1 ${
              passwordStrength.level === "weak"
                ? "text-red-600"
                : passwordStrength.level === "medium"
                ? "text-yellow-600"
                : "text-green-600"
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
