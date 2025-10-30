/**
 * Handle profile form input changes
 */
const handleProfileChange = (
  e,
  setProfileData,
  profileErrors,
  setProfileErrors
) => {
  const { name, value } = e.target;
  setProfileData((prev) => ({ ...prev, [name]: value }));
  if (profileErrors[name]) {
    setProfileErrors((prev) => ({ ...prev, [name]: "" }));
  }
};

export default handleProfileChange;
