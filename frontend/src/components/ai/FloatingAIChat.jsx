import React, { useState, useRef, useCallback } from "react";
import styles from "./FloatingAIChat.module.css";
import PopupChatPanel from "./PopupChatPanel";

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleOverlayClick = useCallback((e) => {
    // Close only if the click target is the overlay itself (outside panel)
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  }, []);

  return (
    <>
      <button
        className={styles.floatingButton}
        onClick={() => setOpen(true)}
        aria-label="Open AI Chat"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#3b82f6" />
          <rect x="8" y="13" width="16" height="9" rx="4.5" fill="#fff" />
          <circle cx="13" cy="17.5" r="1.5" fill="#3b82f6" />
          <circle cx="19" cy="17.5" r="1.5" fill="#3b82f6" />
          <rect x="14" y="21" width="4" height="1.5" rx="0.75" fill="#3b82f6" />
          <rect x="15.5" y="8" width="1" height="4" rx="0.5" fill="#3b82f6" />
        </svg>
      </button>
      {open && (
        <div
          className={styles.overlay}
          onClick={handleOverlayClick}
          aria-label="AI Chat Overlay"
        >
          <div ref={containerRef} className={styles.chatContainer}>
            <PopupChatPanel onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
