import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPanel.module.css";

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

  // Load sessions on mount
  useEffect(() => {
    async function fetchSessions() {
      setLoadingSessions(true);
      try {
        const resp = await fetch(`${getApiBase()}/chat/sessions`);
        const data = await resp.json();
        setSessions(data.sessions || []);
      } catch (err) {
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    }
    fetchSessions();
  }, []);

  // Load messages for selected session
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

  // Scroll to bottom on messages update
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Start new session
  const startNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    window.sessionStorage.setItem("aiSessionId", newSessionId);
    setSelectedSession(newSessionId);
    setMessages([]);
  };

  // Send message
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
        // Refetch logs for session
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
    <div className={styles.panel}>
      <div className={styles.header}>
        <strong>BuildSync Assistant</strong>
        <small>{loading ? "Thinking..." : ""}</small>
      </div>

      <div className={styles.sessionBar}>
        <button className={styles.newSessionBtn} onClick={startNewSession}>
          + New Session
        </button>
        {loadingSessions ? (
          <span>Loading sessions...</span>
        ) : (
          <div className={styles.sessionList}>
            {sessions.map((s) => (
              <button
                key={s._id}
                className={
                  s._id === selectedSession
                    ? styles.sessionSelected
                    : styles.sessionBtn
                }
                onClick={() => setSelectedSession(s._id)}
              >
                {s._id.replace("session-", "Session ")}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.messages} ref={listRef}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>No messages yet.</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`${styles.message} ${styles[m.role] || ""}`}>
            <span className={styles.role}>
              {m.role === "assistant" ? "🤖" : "🧑"}
            </span>
            <span>{m.content}</span>
            {m.timestamp && (
              <span className={styles.timestamp}>
                {new Date(m.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.composer}>
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
  );
}
