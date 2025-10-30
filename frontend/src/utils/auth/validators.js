/**
 * Validate login form data
 */
export const validateLogin = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Validate registration form data
 */
export const validateRegister = (formData) => {
  const errors = {};

  if (!formData.name) {
    errors.name = "Name is required";
  } else if (formData.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

/**
 * Validate email for forgot password
 */
export const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Email is invalid";
  }

  return "";
};
