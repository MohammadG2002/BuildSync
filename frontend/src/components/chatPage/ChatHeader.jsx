import { Phone, Video, MoreVertical } from "lucide-react";
import { getInitials, generateColor } from "../../utils/helpers";
import styles from "../../pages/chat/Chat.module.css";

const ChatHeader = ({ selectedContact }) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatHeaderContent}>
        <div className={styles.chatHeaderLeft}>
          <div
            className={styles.chatHeaderAvatar}
            style={{ backgroundColor: generateColor(selectedContact.name) }}
          >
            {getInitials(selectedContact.name)}
          </div>
          <div>
            <h3 className={styles.chatHeaderName}>{selectedContact.name}</h3>
            <p className={styles.chatHeaderStatus}>
              {selectedContact.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div>
          <button className={styles.iconButton}>
            <Phone className={styles.iconButtonIcon} />
          </button>
          <button className={styles.iconButton}>
            <Video className={styles.iconButtonIcon} />
          </button>
          <button className={styles.iconButton}>
            <MoreVertical className={styles.iconButtonIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
