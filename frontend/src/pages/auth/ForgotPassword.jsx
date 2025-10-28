import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import * as authService from "../../services/authService";
import toast from "react-hot-toast";
import { validateEmail } from "./authModule";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
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
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            {import.meta.env.VITE_APP_NAME || "ProjectHub"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
            Reset your password
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Forgot your password?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 text-sm">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:text-gray-100 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:text-gray-100 text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
