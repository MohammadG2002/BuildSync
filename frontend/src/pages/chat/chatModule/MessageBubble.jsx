import {
  getInitials,
  generateColor,
  getRelativeTime,
} from "../../../utils/helpers";
import styles from "../Chat.module.css";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div
      className={`${styles.messageRow} ${isOwn ? styles.messageRowOwn : ""}`}
    >
      <div
        className={`${styles.messageContent} ${
          isOwn ? styles.messageContentOwn : ""
        }`}
      >
        {!isOwn && (
          <div
            className={styles.messageSenderAvatar}
            style={{
              backgroundColor: generateColor(message.senderName),
            }}
          >
            {getInitials(message.senderName)}
          </div>
        )}
        <div>
          <div
            className={`${styles.messageBubble} ${
              isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther
            }`}
          >
            <p className={styles.messageText}>{message.content}</p>
          </div>
          <p
            className={`${styles.messageTime} ${
              isOwn ? styles.messageTimeOwn : ""
            }`}
          >
            {getRelativeTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
