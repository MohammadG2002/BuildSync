import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getPasswordStrength } from "../../utils/validators";
import {
  AvatarSection,
  ProfileTabs,
  ProfileForm,
  PasswordForm,
  AccountInfo,
  PreferencesSection,
} from "../../components/profile";
import handleProfileChange from "../../utils/profile/handleProfileChange";
import handlePasswordChange from "../../utils/profile/handlePasswordChange";
import handleTogglePassword from "../../utils/profile/handleTogglePassword";
import handleUpdateProfile from "../../utils/profile/handleUpdateProfile";
import handleChangePassword from "../../utils/profile/handleChangePassword";
import handleAvatarUpload from "../../utils/profile/handleAvatarUpload";
import styles from "../../components/profile/Profile.module.css";

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

  const passwordStrength = passwordData.newPassword
    ? getPasswordStrength(passwordData.newPassword)
    : null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          variant="ghost"
          onClick={() => navigate("/app/dashboard")}
          className={styles.backButton}
        >
          <ArrowLeft className={styles.backIcon} />
        </Button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Profile Settings</h1>
          <p className={styles.subtitle}>
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
            onChange={(e) =>
              handleProfileChange(
                e,
                setProfileData,
                profileErrors,
                setProfileErrors
              )
            }
            onSubmit={(e) =>
              handleUpdateProfile(
                e,
                profileData,
                setProfileErrors,
                updateUser,
                setLoading
              )
            }
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
            onChange={(e) =>
              handlePasswordChange(
                e,
                setPasswordData,
                passwordErrors,
                setPasswordErrors
              )
            }
            onSubmit={(e) =>
              handleChangePassword(
                e,
                passwordData,
                setPasswordErrors,
                setPasswordData,
                setLoading
              )
            }
            onTogglePassword={(field) =>
              handleTogglePassword(field, setShowPasswords)
            }
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
