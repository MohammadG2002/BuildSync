import { validateLogin } from "../../../components/auth";

/**
 * Handle login form submission
 */
const handleSubmit = async (e, formData, setErrors, login, setLoading) => {
  e.preventDefault();

  const newErrors = validateLogin(formData);
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    await login(formData);
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};

export default handleSubmit;
