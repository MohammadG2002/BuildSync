import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPanel.module.css";

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are BuildSync assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: "user", content: trimmed };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const resp = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const errMsg = data?.details || data?.error || `HTTP ${resp.status}`;
        console.error("Chat API error", resp.status, errMsg);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: `(Error: ${errMsg})` },
        ]);
      } else {
        const assistant = { role: "assistant", content: data.reply || "" };
        setMessages((m) => [...m, assistant]);
      }
    } catch (e) {
      console.error("Chat error", e);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `(Error: ${e.message || "failed to get reply"})`,
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

      <div className={styles.messages} ref={listRef}>
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div
              key={i}
              className={`${styles.message} ${styles[m.role] || ""}`}
            >
              {m.content}
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
          placeholder="Ask the assistant..."
        />
        <button className={styles.sendButton} onClick={send} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
