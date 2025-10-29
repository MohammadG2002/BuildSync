import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import * as authService from "../../services/authService";
import toast from "react-hot-toast";
import { validateEmail } from "./authModule";
import styles from "./authModule/Auth.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      setError(error.message || "Failed to send reset email");
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.forgotContainer}>
        <div className={styles.forgotWrapper}>
          <div className={styles.forgotCard}>
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <Mail className={styles.successIconSvg} />
              </div>
              <h2 className={styles.successTitle}>Check your email</h2>
              <p className={styles.successDescription}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className={styles.successHint}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className={styles.successActions}>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Try another email
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotWrapper}>
        <div className={styles.forgotHeader}>
          <h1 className={styles.forgotTitle}>
            {import.meta.env.VITE_APP_NAME || "ProjectHub"}
          </h1>
          <p className={styles.forgotSubtitle}>Reset your password</p>
        </div>

        <div className={styles.forgotCard}>
          <div className={styles.forgotCardHeader}>
            <h2 className={styles.forgotCardTitle}>Forgot your password?</h2>
            <p className={styles.forgotCardDescription}>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
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
              className="w-full"
            >
              Send Reset Link
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
};

export default ForgotPassword;
