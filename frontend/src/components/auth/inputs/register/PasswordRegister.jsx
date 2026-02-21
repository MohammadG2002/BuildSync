import React, { useState } from "react";
import handleChange from "../../../../utils/auth/handleChangeRegister";

const PasswordRegister = ({
  formData,
  setFormData,
  errors,
  setErrors,
  passwordStrength,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordInput
      label="Password"
      name="password"
      placeholder="Create a strong password"
      value={formData.password}
      onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
      error={errors.password}
      icon={Lock}
      autoComplete="new-password"
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      showStrength={true}
      passwordStrength={passwordStrength}
    />
  );
};

export default PasswordRegister;
