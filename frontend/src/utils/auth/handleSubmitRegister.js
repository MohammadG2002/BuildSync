import { validateRegister } from "./validators";

/**
 * Handle register form submission
 */
const handleSubmit = async (
  e,
  formData,
  setErrors,
  action,
  setLoading,
  actionType = "register"
) => {
  e.preventDefault();

  // If actionType is 'register' perform full register validations,
  // otherwise perform minimal validation for login.
  let newErrors = {};
  if (actionType === "register") {
    newErrors = validateRegister(formData);
  } else {
    // Minimal login validation
    if (!formData.email) newErrors.email = "Email is required";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    await action(formData);
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    setLoading(false);
  }
};

export default handleSubmit;
