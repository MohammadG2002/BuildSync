import React from "react";
import chatStyles from "../../pages/chat/Chat.module.css";
import { generateColor, getRelativeTime } from "../../utils/helpers";
import AIAvatarIcon from "./AIAvatarIcon";

export default function ChatMessages({ messages, listRef }) {
  return (
    <div className={chatStyles.messagesArea} ref={listRef}>
      {messages.length === 0 && (
        <div className={chatStyles.emptyState}>
          <div className={chatStyles.emptyTitle}>No messages yet</div>
          <div className={chatStyles.emptyDescription}>
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
            className={`${chatStyles.messageWrapper} ${
              isOwn ? chatStyles.messageWrapperSent : ""
            }`}
          >
            {!isOwn && (
              <div
                className={chatStyles.messageAvatar}
                style={{
                  backgroundColor: generateColor(senderName),
                  padding: 0,
                }}
                title="AI Assistant"
              >
                <AIAvatarIcon />
              </div>
            )}
            <div className={chatStyles.messageContent}>
              <div
                className={`${chatStyles.messageBubble} ${
                  isOwn ? chatStyles.messageBubbleSent : ""
                }`}
              >
                <p className={chatStyles.messageText}>{m.content}</p>
              </div>
              <p className={chatStyles.messageTime}>
                {getRelativeTime(m.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
