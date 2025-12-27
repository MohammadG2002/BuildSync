import { Camera } from "lucide-react";
import Button from "../../common/button/Button/Button";
import { getInitials, generateColor } from "../../../utils/helpers";
import styles from "./AvatarSection.module.css";

const AvatarSection = ({
  userName,
  userEmail,
  avatarUrl,
  onAvatarUpload,
  onRemoveAvatar,
  editable = true,
}) => {
  return (
    <div className={styles.avatarContainer}>
      <div className={styles.avatarWrapper}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${userName || "User"} avatar`}
            className={styles.avatarImage}
          />
        ) : (
          <div
            className={styles.avatar}
            style={{ backgroundColor: generateColor(userName || "User") }}
          >
            {getInitials(userName || "User")}
          </div>
        )}
        {editable && (
          <button
            onClick={onAvatarUpload}
            className={styles.avatarUploadButton}
          >
            <Camera className={styles.avatarUploadIcon} />
          </button>
        )}
      </div>
      <div className={styles.avatarInfo}>
        <h3 className={styles.avatarName}>{userName}</h3>
        <p className={styles.avatarEmail}>{userEmail}</p>
        {editable && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onAvatarUpload}
              className={styles.changeAvatarButton}
            >
              <Camera className={styles.changeAvatarIcon} />
              Change Avatar
            </Button>
            {avatarUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveAvatar}
                className={styles.changeAvatarButton}
              >
                Remove Avatar
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarSection;
