import ChatHeader from "./ChatHeader";
import MessagesArea from "./MessagesArea";
import MessageInput from "./MessageInput";
import styles from "../../pages/chat/Chat.module.css";

const ChatArea = ({
  selectedContact,
  messages,
  currentUserId,
  message,
  onMessageChange,
  onSendMessage,
  messagesEndRef,
}) => {
  return (
    <div className={styles.chatArea}>
      <ChatHeader selectedContact={selectedContact} />
      <MessagesArea
        messages={messages}
        currentUserId={currentUserId}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput
        message={message}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default ChatArea;
