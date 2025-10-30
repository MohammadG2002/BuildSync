import { validateRegister } from "../../../components/auth";

/**
 * Handle register form submission
 */
const handleSubmit = async (e, formData, setErrors, register, setLoading) => {
  e.preventDefault();

  const newErrors = validateRegister(formData);
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    await register(formData);
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    setLoading(false);
  }
};

export default handleSubmit;
