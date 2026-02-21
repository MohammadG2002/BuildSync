import React, { useState } from "react";
import handleChange from "../../../../utils/auth/handleChangeRegister";

const PasswordRepeat = ({ formData, setFormData, errors, setErrors }) => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <PasswordInput
      label="Confirm Password"
      name="confirmPassword"
      placeholder="Confirm your password"
      value={formData.confirmPassword}
      onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
      error={errors.confirmPassword}
      icon={Lock}
      autoComplete="new-password"
      showPassword={showConfirmPassword}
      onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
    />
  );
};

export default PasswordRepeat;
