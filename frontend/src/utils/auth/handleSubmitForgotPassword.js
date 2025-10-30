import toast from "react-hot-toast";

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    toast.success("Password reset link sent to your email!");
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to send reset link");
  } finally {
    setLoading(false);
  }
};

export default handleSubmit;
