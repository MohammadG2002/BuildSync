import toast from "react-hot-toast";
import {
  sendVerificationCode,
  verifyEmailCode,
} from "../../services/authService/verification";

export const handleSendCode = async (
  formData,
  setErrors,
  setStep,
  setLoading
) => {
  try {
    setLoading(true);
    setErrors({});

    // Basic validation
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }

    await sendVerificationCode(formData.email);
    toast.success("Verification code sent to your email");
    setStep(2); // Move to verification step
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send verification code";
    setErrors({ email: message });
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

export const handleVerifyCode = async (
  formData,
  setErrors,
  setStep,
  setLoading
) => {
  try {
    setLoading(true);
    setErrors({});

    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      setErrors({ verificationCode: "Please enter the 6-digit code" });
      return;
    }

    await verifyEmailCode(formData.email, formData.verificationCode);
    toast.success("Email verified successfully");
    setStep(3); // Move to complete registration
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Invalid verification code";
    setErrors({ verificationCode: message });
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

export const handleResendCode = async (email) => {
  try {
    await sendVerificationCode(email);
    toast.success("New code sent");
  } catch (error) {
    toast.error("Failed to resend code");
  }
};
