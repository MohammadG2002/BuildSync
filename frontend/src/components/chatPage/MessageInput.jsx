import { Send, Paperclip, Smile } from "lucide-react";
import Button from "../common/Button";
import styles from "../../pages/chat/Chat.module.css";

const MessageInput = ({ message, onMessageChange, onSendMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className={styles.inputArea}>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <button type="button" className={styles.iconButton}>
          <Paperclip className={styles.iconButtonIcon} />
        </button>
        <button type="button" className={styles.iconButton}>
          <Smile className={styles.iconButtonIcon} />
        </button>
        <div className={styles.inputWrapper}>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows="1"
            className={styles.input}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim()}
          className={styles.sendButton}
        >
          <Send className={styles.submitButtonIcon} />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
