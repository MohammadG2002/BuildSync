import React from "react";
import styles from "./ChatMessages.module.css";
import { generateColor, getRelativeTime } from "../../../utils/helpers";
import AIAvatarIcon from "../AIAvatarIcon/AIAvatarIcon";

export default function ChatMessages({ messages, listRef }) {
  return (
    <div className={styles.messagesArea} ref={listRef}>
      {messages.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>No messages yet</div>
          <div className={styles.emptyDescription}>
            Start the conversation by sending a message.
          </div>
        </div>
      )}
      {messages.map((m, i) => {
        const isOwn = m.role !== "assistant";
        const senderName = isOwn ? "You" : "Assistant";
        return (
          <div
            key={i}
            className={`${styles.messageWrapper} ${
              isOwn ? styles.messageWrapperSent : ""
            }`}
          >
            {!isOwn && (
              <div
                className={styles.messageAvatar}
                style={{
                  backgroundColor: generateColor(senderName),
                  padding: 0,
                }}
                title="AI Assistant"
              >
                <AIAvatarIcon />
              </div>
            )}
            <div className={styles.messageContent}>
              <div
                className={`${styles.messageBubble} ${
                  isOwn ? styles.messageBubbleSent : ""
                }`}
              >
                <p className={styles.messageText}>{m.content}</p>
              </div>
              <p className={styles.messageTime}>
                {getRelativeTime(m.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
