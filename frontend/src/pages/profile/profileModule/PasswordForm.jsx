import { Lock, Eye, EyeOff } from "lucide-react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

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
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="relative">
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
          className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500"
        >
          {showPasswords.current ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="relative">
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
          className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500"
        >
          {showPasswords.new ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>

        {/* Password Strength Indicator */}
        {passwordStrength && (
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

      <div className="relative">
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
          className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500"
        >
          {showPasswords.confirm ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Password requirements:</strong>
        </p>
        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
          <li>At least 8 characters long</li>
          <li>Contains uppercase and lowercase letters</li>
          <li>Contains at least one number</li>
        </ul>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="gap-2"
        >
          <Lock className="w-5 h-5" />
          Change Password
        </Button>
      </div>
    </form>
  );
};

export default PasswordForm;
