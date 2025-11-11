import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPanel.module.css";
import chatStyles from "../../pages/chat/Chat.module.css";
import {
  getInitials,
  generateColor,
  getRelativeTime,
} from "../../utils/helpers";

function getApiBase() {
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
}

export default function ChatPanel() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    async function fetchSessions() {
      setLoadingSessions(true);
      try {
        const resp = await fetch(`${getApiBase()}/chat/sessions`);
        const data = await resp.json();
        setSessions(data.sessions || []);
        const restored = window.sessionStorage.getItem("aiSessionId");
        if (restored) {
          setSelectedSession(restored);
        }
      } catch (err) {
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    async function fetchLogs() {
      if (!selectedSession) return;
      setLoading(true);
      try {
        const resp = await fetch(
          `${getApiBase()}/chat/logs/${selectedSession}`
        );
        const data = await resp.json();
        setMessages(data.logs || []);
      } catch (err) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [selectedSession]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const startNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    window.sessionStorage.setItem("aiSessionId", newSessionId);
    setSessions((prev) => [
      { _id: newSessionId, local: true },
      ...(prev || []),
    ]);
    setSelectedSession(newSessionId);
    setMessages([]);
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || !selectedSession) return;
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch(`${getApiBase()}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId: selectedSession }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const errMsg = data?.error || `HTTP ${resp.status}`;
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `(Error: ${errMsg})`,
            timestamp: new Date(),
          },
        ]);
      } else {
        const logsResp = await fetch(
          `${getApiBase()}/chat/logs/${selectedSession}`
        );
        const logsData = await logsResp.json();
        setMessages(logsData.logs || []);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `(Error: ${e.message || "failed to get reply"})`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={styles.panelExpanded}>
      <aside className={styles.sidebar}>
        <div className={styles.sessionsContainer}>
          <div className={styles.sidebarHeader}>
            <strong>Sessions</strong>
            <button className={styles.newSessionBtn} onClick={startNewSession}>
              + New Session
            </button>
          </div>
          <div className={styles.sessionListSidebar}>
            {loadingSessions ? (
              <span>Loading sessions...</span>
            ) : (
              <div className={styles.sessionButtonsContainer}>
                {sessions.map((s) => {
                  const id = s?._id || s;
                  return (
                    <button
                      key={id}
                      className={
                        id === selectedSession
                          ? styles.sessionSelectedSidebar
                          : styles.sessionBtnSidebar
                      }
                      onClick={() => setSelectedSession(id)}
                    >
                      {String(id).replace("session-", "Session ")}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
      <div className={styles.mainChatArea}>
        <div className={styles.header}>
          <strong>BuildSync Assistant</strong>
          <small>{loading ? "Thinking..." : ""}</small>
        </div>
        <div
          className={`${styles.messagesExpanded} ${chatStyles.messagesArea}`}
          ref={listRef}
        >
          {messages.length === 0 && (
            <div className={chatStyles.emptyState}>
              <div className={chatStyles.emptyTitle}>No messages yet</div>
              <div className={chatStyles.emptyDescription}>
                Start the conversation by sending a message.
              </div>
            </div>
          )}
          {messages.map((m, i) => {
            const isOwn = m.role !== "assistant";
            const senderName = isOwn ? "You" : "Assistant";
            return (
              <div
                key={i}
                className={`${chatStyles.messageWrapper} ${
                  isOwn ? chatStyles.messageWrapperSent : ""
                }`}
              >
                {!isOwn && (
                  <div
                    className={chatStyles.messageAvatar}
                    style={{
                      backgroundColor: generateColor(senderName),
                      padding: 0,
                    }}
                    title="AI Assistant"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="4"
                        y="8"
                        width="20"
                        height="14"
                        rx="7"
                        fill="#fff"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      <circle cx="10" cy="15" r="2" fill="#3b82f6" />
                      <circle cx="18" cy="15" r="2" fill="#3b82f6" />
                      <rect
                        x="11"
                        y="19"
                        width="6"
                        height="2"
                        rx="1"
                        fill="#3b82f6"
                      />
                      <rect
                        x="12.5"
                        y="4"
                        width="3"
                        height="6"
                        rx="1.5"
                        fill="#3b82f6"
                      />
                    </svg>
                  </div>
                )}
                <div className={chatStyles.messageContent}>
                  <div
                    className={`${chatStyles.messageBubble} ${
                      isOwn ? chatStyles.messageBubbleSent : ""
                    }`}
                  >
                    <p className={chatStyles.messageText}>{m.content}</p>
                  </div>
                  <p className={chatStyles.messageTime}>
                    {getRelativeTime(m.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
      </div>
    </div>
  );
}
