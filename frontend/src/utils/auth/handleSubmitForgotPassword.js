import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

/**
 * Handle forgot password form submission
 */
const handleSubmit = async (e, email, setLoading, setSuccess) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email address");
    return;
  }

  setLoading(true);
  try {
    await forgotPassword(email);
    setSuccess(true);
    toast.success("Password reset code sent to your email!");
  } catch (error) {
    console.error("Error:", error);
    toast.error(error.message || "Failed to send reset code");
  } finally {
    setLoading(false);
  }
};

export default handleSubmit;
