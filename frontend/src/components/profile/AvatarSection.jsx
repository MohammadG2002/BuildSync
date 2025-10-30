import { Camera } from "lucide-react";
import Button from "../../../components/common/Button";
import { getInitials, generateColor } from "../../../utils/helpers";
import styles from "./Profile.module.css";

const AvatarSection = ({ userName, userEmail, onAvatarUpload }) => {
  return (
    <div className={styles.avatarContainer}>
      <div className={styles.avatarWrapper}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: generateColor(userName || "User") }}
        >
          {getInitials(userName || "User")}
        </div>
        <button onClick={onAvatarUpload} className={styles.avatarUploadButton}>
          <Camera className={styles.avatarUploadIcon} />
        </button>
      </div>
      <div className={styles.avatarInfo}>
        <h3 className={styles.avatarName}>{userName}</h3>
        <p className={styles.avatarEmail}>{userEmail}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onAvatarUpload}
          className={styles.changeAvatarButton}
        >
          <Camera className={styles.changeAvatarIcon} />
          Change Avatar
        </Button>
      </div>
    </div>
  );
};

export default AvatarSection;
