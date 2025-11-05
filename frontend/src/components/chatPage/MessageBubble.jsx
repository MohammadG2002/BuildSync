import {
  getInitials,
  generateColor,
  getRelativeTime,
} from "../../utils/helpers";
import styles from "../../pages/chat/Chat.module.css";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div
      className={`${styles.messageWrapper} ${
        isOwn ? styles.messageWrapperSent : ""
      }`}
    >
      {!isOwn && (
        <div
          className={styles.messageAvatar}
          style={{ backgroundColor: generateColor(message.senderName) }}
        >
          {getInitials(message.senderName)}
        </div>
      )}
      <div className={styles.messageContent}>
        <div
          className={`${styles.messageBubble} ${
            isOwn ? styles.messageBubbleSent : ""
          }`}
        >
          <p className={styles.messageText}>{message.content}</p>
        </div>
        <p className={styles.messageTime}>
          {getRelativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
