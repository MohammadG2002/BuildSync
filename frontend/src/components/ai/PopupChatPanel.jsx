import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./PopupChatPanel.module.css";
import { useLoadSessions } from "../../hooks/ai/useLoadSessions";
import { useLoadLogs } from "../../hooks/ai/useLoadLogs";
import { useSendHandler } from "../../hooks/ai/useSendHandler";
import { useChatHandlers } from "../../hooks/ai/useChatHandlers";
import AIAvatarIcon from "./AIAvatarIcon";
import { getRelativeTime } from "../../utils/helpers";

export default function PopupChatPanel({ onClose }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [reloadLogs, setReloadLogs] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const listRef = useRef(null);
  const textAreaRef = useRef(null);

  // Load sessions and logs
  useLoadSessions(setSessions, setSelectedSession, setLoadingSessions);
  useLoadLogs(selectedSession, setMessages, setLoading, reloadLogs);

  // Auto-create a session if none selected after initial load
  useEffect(() => {
    if (!loadingSessions && !selectedSession) {
      if (sessions && sessions.length > 0) {
        setSelectedSession(sessions[0]._id || sessions[0]);
      } else {
        startNewSession();
      }
    }
  }, [loadingSessions, selectedSession, sessions]);

  const { startNewSession, endSession } = useChatHandlers({
    setSessions,
    setSelectedSession,
    setMessages,
    setReloadLogs,
  });
  const { send } = useSendHandler({
    selectedSession,
    setInput,
    setLoading,
    setMessages,
    setReloadLogs,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = useCallback(() => {
    send(input);
  }, [send, input]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowMenu(false);
  };

  const startSession = () => {
    // Force a brand new session id overriding persisted one.
    window.localStorage.removeItem("aiSessionId");
    startNewSession();
    setShowMenu(false);
  };

  return (
    <div className={styles.popupRoot}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.statusDot} />
          <span>BuildSync Assistant</span>
        </div>
        <div className={styles.iconButtons}>
          <button
            className={styles.iconBtn}
            aria-label="Options"
            onClick={() => setShowMenu((m) => !m)}
          >
            ⋯
          </button>
          <button
            className={styles.iconBtn}
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
          {showMenu && (
            <div className={styles.menuDropdown}>
              <button className={styles.menuItem} onClick={startSession}>
                ➕ New Session (override)
              </button>
              <button className={styles.menuItem} onClick={clearChat}>
                🧹 Clear Messages
              </button>
              <button
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => {
                  // End persistent session (user explicitly disconnects)
                  window.localStorage.removeItem("aiSessionId");
                  setSessions([]);
                  setSelectedSession(null);
                  setMessages([]);
                  setShowMenu(false);
                }}
              >
                End Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesWrapper} ref={listRef}>
        {messages.length === 0 && !loading && (
          <div className={styles.placeholder}>Say hi to the assistant 👋</div>
        )}
        {messages.map((m, i) => {
          const isUser = m.role !== "assistant";
          return (
            <div
              key={i}
              className={`${styles.bubbleRow} ${
                isUser ? styles.userRow : styles.assistantRow
              }`}
            >
              {!isUser && (
                <div className={styles.avatarIcon}>
                  <AIAvatarIcon />
                </div>
              )}
              <div
                className={isUser ? styles.bubbleUser : styles.bubbleAssistant}
              >
                {m.content}
              </div>
              <div
                className={`${styles.timestamp} ${isUser ? styles.user : ""}`}
              >
                {getRelativeTime(m.timestamp || new Date())}
              </div>
            </div>
          );
        })}
        {loading && <div className={styles.placeholder}>Thinking…</div>}
      </div>

      {/* Composer */}
      <div className={styles.composer}>
        <div className={styles.inputRow}>
          <textarea
            ref={textAreaRef}
            className={styles.textArea}
            placeholder="Message BuildSync Assistant"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading || !selectedSession}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={loading || !selectedSession || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
