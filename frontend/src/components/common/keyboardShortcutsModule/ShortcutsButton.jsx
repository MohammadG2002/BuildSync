import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./KeyboardShortcuts.module.css";

const ShortcutsButton = () => {
  const navigate = useNavigate();
  return (
    <button
      data-onboarding="shortcuts-button"
      onClick={() => navigate("/app/chat/ai")}
      className={styles.shortcutsButton}
      title="AI Chat"
    >
      <Bot className={styles.shortcutsIcon} />
      <span className={styles.shortcutsTooltip}>AI Chat</span>
    </button>
  );
};

export default ShortcutsButton;
