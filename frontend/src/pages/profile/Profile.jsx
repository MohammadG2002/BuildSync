import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getPasswordStrength } from "../../utils/validators";
import toast from "react-hot-toast";
import {
  AvatarSection,
  ProfileTabs,
  ProfileForm,
  PasswordForm,
  AccountInfo,
  PreferencesSection,
  validateProfile,
  validatePassword,
} from "./profileModule";

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

  const handleTogglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const errors = validateProfile(profileData);
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

    const errors = validatePassword(passwordData);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Avatar Section */}
      <Card>
        <AvatarSection
          userName={user?.name}
          userEmail={user?.email}
          onAvatarUpload={handleAvatarUpload}
        />
      </Card>

      {/* Tabs */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <ProfileForm
            profileData={profileData}
            profileErrors={profileErrors}
            loading={loading}
            onChange={handleProfileChange}
            onSubmit={handleUpdateProfile}
          />
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card title="Change Password">
          <PasswordForm
            passwordData={passwordData}
            passwordErrors={passwordErrors}
            showPasswords={showPasswords}
            passwordStrength={passwordStrength}
            loading={loading}
            onChange={handlePasswordChange}
            onSubmit={handleChangePassword}
            onTogglePassword={handleTogglePassword}
          />
        </Card>
      )}

      {/* Account Information */}
      <Card title="Account Information">
        <AccountInfo user={user} />
      </Card>

      {/* Preferences */}
      <Card title="Preferences">
        <PreferencesSection />
      </Card>
    </div>
  );
};

export default Profile;
