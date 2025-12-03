import React from "react";
import styles from "./ChatComposer.module.css";

export default function ChatComposer({
  input,
  setInput,
  onKey,
  send,
  loading,
  selectedSession,
}) {
  return (
    <div className={styles.composerExpanded}>
      <textarea
        className={styles.input}
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        placeholder={
          selectedSession ? "Ask the assistant..." : "Start a session first"
        }
        disabled={!selectedSession}
      />
      <button
        className={styles.sendButton}
        onClick={send}
        disabled={loading || !selectedSession || !input.trim()}
      >
        Send
      </button>
    </div>
  );
}
