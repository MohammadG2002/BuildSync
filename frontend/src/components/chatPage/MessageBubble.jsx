import {
  getInitials,
  generateColor,
  getRelativeTime,
} from "../../utils/helpers";
import styles from "../../pages/chat/Chat.module.css";
import { buildAbsoluteUrl } from "../../utils/buildAbsoluteUrl";

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
          {Array.isArray(message.attachments) &&
            message.attachments.length > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {message.attachments.map((att, idx) => {
                  const isImg = (att.type || "").startsWith("image/");
                  const name =
                    att.name || att.filename || `Attachment ${idx + 1}`;
                  const rawUrl =
                    att.url || att.path || att.href || att.relativeUrl;
                  const url = buildAbsoluteUrl(rawUrl);
                  if (!url) return null;
                  return isImg ? (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.messageAttachment}
                      title={name}
                      style={{ padding: 0 }}
                    >
                      <img
                        src={url}
                        alt={name}
                        style={{
                          display: "block",
                          width: 120,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </a>
                  ) : (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.messageAttachment}
                      title={name}
                    >
                      <span className={styles.messageAttachmentIcon}>📎</span>
                      <span
                        style={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {name}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          {message.content && (
            <p className={styles.messageText}>{message.content}</p>
          )}
        </div>
        <p className={styles.messageTime}>
          {getRelativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
