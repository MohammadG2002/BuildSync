import { Phone, Video, MoreVertical } from "lucide-react";
import { getInitials, generateColor } from "../../utils/helpers";
import styles from "../../pages/chat/Chat.module.css";

const ChatHeader = ({ selectedContact }) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatHeaderInfo}>
        <div className={styles.contactAvatarContainer}>
          <div
            className={styles.chatAvatar}
            style={{
              backgroundColor: generateColor(selectedContact.name),
            }}
          >
            {getInitials(selectedContact.name)}
          </div>
          {selectedContact.online && (
            <div className={styles.onlineIndicator}></div>
          )}
        </div>
        <div>
          <h3 className={styles.chatTitle}>{selectedContact.name}</h3>
          <p className={styles.chatStatus}>
            {selectedContact.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className={styles.chatActions}>
        <button className={styles.actionButton}>
          <Phone className={styles.actionIcon} />
        </button>
        <button className={styles.actionButton}>
          <Video className={styles.actionIcon} />
        </button>
        <button className={styles.actionButton}>
          <MoreVertical className={styles.actionIcon} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
