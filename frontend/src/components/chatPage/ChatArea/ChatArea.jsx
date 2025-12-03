import ChatHeader from "../ChatHeader/ChatHeader";
import MessagesArea from "../MessagesArea/MessagesArea";
import MessageInput from "../MessageInput/MessageInput";
import styles from "./ChatArea.module.css";

const ChatArea = ({
  selectedContact,
  messages,
  currentUserId,
  message,
  onMessageChange,
  onSendMessage,
  messagesEndRef,
  onContactStatusChange,
}) => {
  return (
    <div className={styles.chatArea}>
      <ChatHeader
        selectedContact={selectedContact}
        onContactStatusChange={onContactStatusChange}
      />
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
