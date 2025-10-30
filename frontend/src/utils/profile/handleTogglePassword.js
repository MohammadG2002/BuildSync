/**
 * Toggle password visibility
 */
const handleTogglePassword = (field, setShowPasswords) => {
  setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
};

export default handleTogglePassword;
