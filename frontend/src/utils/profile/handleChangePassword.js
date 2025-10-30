import * as authService from "../../services/authService";
import toast from "react-hot-toast";
import validatePassword from "./validatePassword";

/**
 * Handle password change submission
 */
const handleChangePassword = async (
  e,
  passwordData,
  setPasswordErrors,
  setPasswordData,
  setLoading
) => {
  e.preventDefault();

  const errors = validatePassword(passwordData);
  if (Object.keys(errors).length > 0) {
    setPasswordErrors(errors);
    return;
  }

  setLoading(true);
  try {
    await authService.changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast.success("Password changed successfully!");
  } catch (error) {
    console.error("Error changing password:", error);
    toast.error("Failed to change password");
  } finally {
    setLoading(false);
  }
};

export default handleChangePassword;
