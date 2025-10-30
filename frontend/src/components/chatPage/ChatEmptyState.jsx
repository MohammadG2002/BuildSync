import { Send } from "lucide-react";
import styles from "../../pages/chat/Chat.module.css";

const ChatEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <div className={styles.emptyStateIcon}>
          <Send className={styles.emptyStateIconSvg} />
        </div>
        <h3 className={styles.emptyStateTitle}>Select a conversation</h3>
        <p className={styles.emptyStateSubtitle}>
          Choose a contact from the list to start chatting
        </p>
      </div>
    </div>
  );
};

export default ChatEmptyState;
