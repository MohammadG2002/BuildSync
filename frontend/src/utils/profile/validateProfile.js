/**
 * Validate profile form data
 * @param {Object} profileData - Profile form data
 * @returns {Object} Validation errors object
 */
const validateProfile = (profileData) => {
  const errors = {};
  if (!profileData.name.trim()) {
    errors.name = "Name is required";
  }
  if (!profileData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
    errors.email = "Email is invalid";
  }
  return errors;
};

export default validateProfile;
