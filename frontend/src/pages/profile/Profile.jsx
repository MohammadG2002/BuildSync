import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/card/Card/Card";
import Button from "../../components/common/button/Button/Button";
import { getPasswordStrength } from "../../utils/validators";
import AvatarSection from "../../components/profile/AvatarSection/AvatarSection";
import ProfileTabs from "../../components/profile/ProfileTabs/ProfileTabs";
import ProfileForm from "../../components/profile/ProfileForm/ProfileForm";
import PasswordForm from "../../components/profile/PasswordForm/PasswordForm";
import AccountInfo from "../../components/profile/AccountInfo/AccountInfo";
import PreferencesSection from "../../components/profile/PreferencesSection/PreferencesSection";
import handleProfileChange from "../../utils/profile/handleProfileChange";
import handlePasswordChange from "../../utils/profile/handlePasswordChange";
import handleTogglePassword from "../../utils/profile/handleTogglePassword";
import handleUpdateProfile from "../../utils/profile/handleUpdateProfile";
import handleChangePassword from "../../utils/profile/handleChangePassword";
import handleAvatarUpload from "../../utils/profile/handleAvatarUpload";
import handleRemoveAvatar from "../../utils/profile/handleRemoveAvatar";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const routeUserIdRaw = params.userId || params.id;
  const routeUserId = routeUserIdRaw ? String(routeUserIdRaw) : null;

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'security'
  const [loading, setLoading] = useState(false);
  const [viewUser, setViewUser] = useState(null);

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

  const currentUserId = user
    ? String(user._id || user.id || user?.id || "")
    : null;
  const isOwner = !routeUserId || routeUserId === currentUserId;

  // Debug: log ids to help track why the wrong profile renders
  // Remove these logs once the issue is resolved
  // eslint-disable-next-line no-console
  console.debug(
    "Profile routeUserIdRaw:",
    routeUserIdRaw,
    "routeUserId:",
    routeUserId
  );
  // eslint-disable-next-line no-console
  console.debug("Profile currentUserId:", currentUserId, "isOwner:", isOwner);

  useEffect(() => {
    // If viewing another user's profile, fetch it
    if (routeUserId && routeUserId !== currentUserId) {
      (async () => {
        try {
          const base = import.meta.env.VITE_API_URL || "/api";
          const url = `${base.replace(/\/$/, "")}/users/${routeUserId}`;
          const res = await fetch(url, { credentials: "include" });
          if (!res.ok) throw new Error("Failed to fetch user");
          const json = await res.json();
          const fetched = json?.data?.user;
          // eslint-disable-next-line no-console
          console.debug(
            "Fetched profile for routeUserId:",
            routeUserId,
            fetched
          );
          if (fetched) {
            setViewUser(fetched);
            setProfileData({
              name: fetched.name || "",
              email: fetched.email || "",
              phone: fetched.phone || "",
              bio: fetched.bio || "",
            });
            // When viewing another user, ensure profile tab is shown and other tabs hidden
            setActiveTab("profile");
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to load user profile:", err);
        }
      })();
    } else {
      // viewing own profile
      setViewUser(null);
      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
      });
    }
  }, [routeUserId, user]);

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
          <h1 className={styles.title}>
            {isOwner ? "Profile Settings" : `${profileData.name || "Profile"}`}
          </h1>
          <p className={styles.subtitle}>
            {isOwner
              ? "Manage your account settings and preferences"
              : "View user profile"}
          </p>
        </div>
      </div>

      {/* Avatar Section */}
      <Card>
        <AvatarSection
          userName={viewUser?.name || user?.name}
          userEmail={viewUser?.email || user?.email}
          avatarUrl={viewUser?.avatar || user?.avatar}
          onAvatarUpload={
            isOwner ? () => handleAvatarUpload(updateUser) : undefined
          }
          onRemoveAvatar={
            isOwner
              ? () => handleRemoveAvatar(updateUser, user?.avatar)
              : undefined
          }
          editable={isOwner}
        />
      </Card>

      {/* Tabs */}
      {isOwner && (
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <ProfileForm
            profileData={profileData}
            profileErrors={profileErrors}
            loading={loading}
            onChange={
              isOwner
                ? (e) =>
                    handleProfileChange(
                      e,
                      setProfileData,
                      profileErrors,
                      setProfileErrors
                    )
                : undefined
            }
            onSubmit={
              isOwner
                ? (e) =>
                    handleUpdateProfile(
                      e,
                      profileData,
                      setProfileErrors,
                      updateUser,
                      setLoading
                    )
                : undefined
            }
            editable={isOwner}
          />
        </Card>
      )}

      {/* Security Tab */}
      {isOwner && activeTab === "security" && (
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
        <AccountInfo user={isOwner ? user : viewUser || user} />
      </Card>

      {/* Preferences - only editable/viewable for owner */}
      {isOwner && (
        <Card title="Preferences">
          <PreferencesSection />
        </Card>
      )}
    </div>
  );
};

export default Profile;
