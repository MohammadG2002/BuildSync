import React from "react";
import handleChange from "../../../../utils/auth/handleChangeRegister";
import { Mail } from "lucide-react";

const EmailRegister = ({ formData, setFormData, errors, setErrors }) => {
  return (
    <Input
      label="Email"
      type="email"
      name="email"
      placeholder="you@example.com"
      value={formData.email}
      onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
      error={errors.email}
      icon={Mail}
      autoComplete="email"
    />
  );
};

export default EmailRegister;
