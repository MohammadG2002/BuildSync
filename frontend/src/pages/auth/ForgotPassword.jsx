import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Key, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/button/Button";
import Input from "../../components/common/input/Input";
import { forgotPassword, resetPassword } from "../../services/authService";
import styles from "./Auth.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code & Password, 3: Success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setStep(2);
      toast.success("Reset code sent to your email!");
    } catch (err) {
      setError(err.message || "Failed to send reset code");
      toast.error(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Reset code resent to your email!");
    } catch (err) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!code) {
      setError("Please enter the reset code");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await resetPassword({ email, code, newPassword });
      setStep(3);
      toast.success("Password reset successful!");
    } catch (err) {
      setError(err.message || "Failed to reset password");
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Enter Email
  if (step === 1) {
    return (
      <div className={styles.forgotContainer}>
        <div className={styles.forgotWrapper}>
          <div className={styles.forgotHeader}>
            <h1 className={styles.forgotTitle}>
              {import.meta.env.VITE_APP_NAME || "BuildSync"}
            </h1>
            <p className={styles.forgotSubtitle}>Reset your password</p>
          </div>

          <div className={styles.forgotCard}>
            <div className={styles.forgotCardHeader}>
              <h2 className={styles.forgotCardTitle}>Forgot your password?</h2>
              <p className={styles.forgotCardDescription}>
                Enter your email address and we'll send you a code to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSendCode} className={styles.authForm}>
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                error={error}
                icon={Mail}
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className={styles.fullWidthButton}
              >
                Send Reset Code
              </Button>
            </form>

            <div className={styles.linkWrapper}>
              <Link to="/login" className={styles.backLink}>
                <ArrowLeft className={styles.backIcon} />
                Back to login
              </Link>
            </div>
          </div>

          <div className={styles.linkWrapperCenter}>
            <Link to="/" className={styles.backLink}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Enter Code & New Password
  if (step === 2) {
    return (
      <div className={styles.forgotContainer}>
        <div className={styles.forgotWrapper}>
          <div className={styles.forgotHeader}>
            <h1 className={styles.forgotTitle}>
              {import.meta.env.VITE_APP_NAME || "BuildSync"}
            </h1>
            <p className={styles.forgotSubtitle}>Reset your password</p>
          </div>

          <div className={styles.forgotCard}>
            <div className={styles.forgotCardHeader}>
              <h2 className={styles.forgotCardTitle}>Enter Reset Code</h2>
              <p className={styles.forgotCardDescription}>
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleResetPassword} className={styles.authForm}>
              <Input
                label="Reset Code"
                type="text"
                name="code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                icon={Key}
                maxLength={6}
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                icon={Lock}
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                error={error}
                icon={Lock}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className={styles.fullWidthButton}
              >
                Reset Password
              </Button>
            </form>

            <div className={styles.forgotActions}>
              <button
                onClick={handleResendCode}
                disabled={loading}
                className={styles.forgotActionLink}
              >
                Didn't receive code? Try again
              </button>
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className={styles.forgotActionLink}
              >
                Wrong email? Try with another email
              </button>
            </div>

            <div className={styles.linkWrapper}>
              <Link to="/login" className={styles.backLink}>
                <ArrowLeft className={styles.backIcon} />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotWrapper}>
        <div className={styles.forgotCard}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <Lock className={styles.successIconSvg} />
            </div>
            <h2 className={styles.successTitle}>Password Reset Successful!</h2>
            <p className={styles.successDescription}>
              Your password has been reset successfully.
            </p>
            <p className={styles.successHint}>
              You can now login with your new password.
            </p>
            <div className={styles.successActions}>
              <Button
                onClick={() => navigate("/login")}
                variant="primary"
                className={styles.fullWidthButton}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
