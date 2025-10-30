import MessageBubble from "./MessageBubble";
import styles from "../../pages/chat/Chat.module.css";

const MessagesArea = ({ messages, currentUserId, messagesEndRef }) => {
  return (
    <div className={styles.messagesArea}>
      {messages.map((msg) => {
        const isOwn = msg.senderId === currentUserId;
        return <MessageBubble key={msg.id} message={msg} isOwn={isOwn} />;
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;
