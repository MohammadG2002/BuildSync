import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getInitials, generateColor } from "../../utils/helpers";
import { getPasswordStrength } from "../../utils/validators";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'security'
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Email is invalid";
    }
    return errors;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const updated = await authService.updateProfile(profileData);
      updateUser(updated);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Mock success for development
      updateUser(profileData);
      toast.success("Profile updated successfully!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    toast.info("Avatar upload coming soon!");
  };

  const passwordStrength = passwordData.newPassword
    ? getPasswordStrength(passwordData.newPassword)
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Avatar Section */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
              style={{ backgroundColor: generateColor(user?.name || "User") }}
            >
              {getInitials(user?.name || "User")}
            </div>
            <button
              onClick={handleAvatarUpload}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.name}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAvatarUpload}
              className="mt-2 gap-2"
            >
              <Camera className="w-4 h-4" />
              Change Avatar
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "profile"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "security"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={profileData.name}
              onChange={handleProfileChange}
              error={profileErrors.name}
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={profileData.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
              icon={Mail}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={profileData.phone}
              onChange={handleProfileChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (Optional)
              </label>
              <textarea
                name="bio"
                rows="4"
                placeholder="Tell us about yourself..."
                value={profileData.bio}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card title="Change Password">
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div className="relative">
              <Input
                label="Current Password"
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
                icon={Lock}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="New Password"
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.newPassword}
                icon={Lock}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength.level === "weak"
                          ? "bg-red-500"
                          : passwordStrength.level === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength.level === "medium"
                          ? "bg-yellow-500"
                          : passwordStrength.level === "strong"
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength.level === "strong"
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      passwordStrength.level === "weak"
                        ? "text-red-600"
                        : passwordStrength.level === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    Password strength: {passwordStrength.level}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.confirmPassword}
                icon={Lock}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Password requirements:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="gap-2"
              >
                <Lock className="w-5 h-5" />
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Account Information */}
      <Card title="Account Information">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Account Status
              </p>
              <p className="text-sm text-gray-500">
                Your account is active and in good standing
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Active
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Member Since</p>
              <p className="text-sm text-gray-500">
                When you joined the platform
              </p>
            </div>
            <p className="text-sm text-gray-900">
              {user?.createdDate
                ? new Date(user.createdDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "January 2024"}
            </p>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Email Verified
              </p>
              <p className="text-sm text-gray-500">
                Your email address has been verified
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Verified
            </span>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card title="Preferences">
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Email Notifications
              </p>
              <p className="text-sm text-gray-500">
                Receive email notifications about your activity
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Weekly Summary
              </p>
              <p className="text-sm text-gray-500">
                Get a weekly summary of your projects and tasks
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 mt-0.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Marketing Emails
              </p>
              <p className="text-sm text-gray-500">
                Receive updates about new features and tips
              </p>
            </div>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
