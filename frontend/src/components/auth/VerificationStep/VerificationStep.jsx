import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import Button from "../../common/button/Button/Button";
import Input from "../../common/input/Input/Input";
import styles from "./VerificationStep.module.css";

const VerificationStep = ({
  email,
  onVerify,
  onResend,
  onBack,
  loading,
  error,
}) => {
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(180);
    await onResend();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <div className={styles.verificationContainer}>
      <div className={styles.verificationHeader}>
        <Mail className={styles.verificationIcon} />
        <h3 className={styles.verificationTitle}>Check your email</h3>
        <p className={styles.verificationText}>
          We've sent a 6-digit verification code to
        </p>
        <p className={styles.verificationEmail}>{email}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <Input
          label="Verification Code"
          type="text"
          placeholder="000000"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          error={error}
          maxLength={6}
          autoFocus
          className={styles.codeInput}
        />

        <div className={styles.timerText}>
          {!canResend && (
            <span>
              Code expires in {Math.floor(resendTimer / 60)}:
              {String(resendTimer % 60).padStart(2, "0")}
            </span>
          )}
          {canResend && (
            <button
              type="button"
              onClick={handleResend}
              className={styles.resendButton}
            >
              Resend Code
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={code.length !== 6}
          className={styles.fullWidthButton}
        >
          Verify Email
        </Button>

        <button
          type="button"
          onClick={onBack}
          className={styles.backButton}
          disabled={loading}
        >
          ← Back to form
        </button>
      </form>
    </div>
  );
};

export default VerificationStep;
