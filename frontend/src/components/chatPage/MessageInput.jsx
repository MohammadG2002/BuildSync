import { Send, Paperclip, Smile } from "lucide-react";
import Button from "../../../components/common/Button";
import styles from "../Chat.module.css";

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
    <div className={styles.inputContainer}>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <button type="button" className={styles.inputActionButton}>
          <Paperclip className={styles.inputActionIcon} />
        </button>
        <button type="button" className={styles.inputActionButton}>
          <Smile className={styles.inputActionIcon} />
        </button>
        <div className={styles.textareaContainer}>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows="1"
            className={styles.textarea}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim()}
          className={styles.submitButton}
        >
          <Send className={styles.submitButtonIcon} />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
