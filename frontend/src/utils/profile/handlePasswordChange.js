/**
 * Handle password form input changes
 */
const handlePasswordChange = (
  e,
  setPasswordData,
  passwordErrors,
  setPasswordErrors
) => {
  const { name, value } = e.target;
  setPasswordData((prev) => ({ ...prev, [name]: value }));
  if (passwordErrors[name]) {
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  }
};

export default handlePasswordChange;
