/**
 * Handle register form input changes
 */
const handleChange = (e, setFormData, errors, setErrors) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }
};

export default handleChange;
