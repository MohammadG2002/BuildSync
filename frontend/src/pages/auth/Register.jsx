import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getPasswordStrength } from "../../utils/validators";
import {
  handleSendCode,
  handleVerifyCode,
  handleResendCode,
} from "../../utils/auth/handleVerification";
import handleSubmit from "../../utils/auth/handleSubmitRegister";
import VerificationStep from "../../components/auth/VerificationStep/VerificationStep";
import RegisterForm from "../../components/auth/RegisterForm/RegisterForm";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  verificationCode: "",
};

const Register = () => {
  const { register, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [accountExists, setAccountExists] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;

  const handleVerify = (code) => {
    const updatedForm = { ...formData, verificationCode: code };
    setFormData(updatedForm);
    handleVerifyCode(
      updatedForm,
      setErrors,
      setStep,
      setLoading,
      setAccountExists,
    );
  };

  const handleFinalSubmit = (e) => {
    handleSubmit(
      e,
      formData,
      setErrors,
      accountExists ? login : register,
      setLoading,
      accountExists ? "login" : "register",
    );
  };

  return (
    <>
      {step === 1 && (
        <RegisterForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          passwordStrength={passwordStrength}
          loading={loading}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendCode(formData, setErrors, setStep, setLoading);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 2 && (
        <VerificationStep
          email={formData.email}
          onVerify={handleVerify}
          onResend={() => handleResendCode(formData.email)}
          onBack={() => setStep(1)}
          loading={loading}
          error={errors.verificationCode}
          onFinalSubmit={handleFinalSubmit}
        />
      )}
    </>
  );
};

export default Register;
