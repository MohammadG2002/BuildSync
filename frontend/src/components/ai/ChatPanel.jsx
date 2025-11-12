import React, { useState, useRef } from "react";
import styles from "./ChatPanel.module.css";
import ChatSessionSidebar from "./ChatSessionSidebar";
import ChatMessages from "./ChatMessages";
import ChatComposer from "./ChatComposer";
import { useLoadSessions } from "./useLoadSessions";
import { useLoadLogs } from "./useLoadLogs";
import { useScrollMessages } from "./useScrollMessages";
import { useChatHandlers } from "./useChatHandlers";
import { useSendHandler } from "./useSendHandler";

export default function ChatPanel() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [reloadLogs, setReloadLogs] = useState(0);
  const listRef = useRef(null);

  useLoadSessions(setSessions, setSelectedSession, setLoadingSessions);
  useLoadLogs(selectedSession, setMessages, setLoading, reloadLogs);
  useScrollMessages(listRef, messages, loading);

  const { startNewSession } = useChatHandlers({
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

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const handleDeleteSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => (s?._id || s) !== sessionId));
    if (selectedSession === sessionId) {
      setSelectedSession(null);
      setMessages([]);
    }
    // TODO: Optionally call API to delete session on backend
  };

  const handleRenameSession = (sessionId) => {
    const newName = window.prompt("Enter new session name:");
    if (newName && newName.trim()) {
      setSessions((prev) =>
        prev.map((s) => {
          const id = s?._id || s;
          if (id === sessionId) {
            return { ...s, name: newName.trim() };
          }
          return s;
        })
      );
    }
    // TODO: Optionally call API to rename session on backend
  };

  return (
    <div className={styles.panelExpanded}>
      <div className={styles.sidebarContainer}>
        <strong>BuildSync Assistant</strong>
        <ChatSessionSidebar
          sessions={sessions}
          selectedSession={selectedSession}
          loadingSessions={loadingSessions}
          onSelectSession={setSelectedSession}
          onNewSession={startNewSession}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
        />
      </div>

      <div className={styles.mainChatArea}>
        <div className={styles.header}>
          <small>{loading ? "Thinking..." : ""}</small>
        </div>
        <ChatMessages messages={messages} listRef={listRef} />
        <ChatComposer
          input={input}
          setInput={setInput}
          onKey={onKey}
          send={() => send(input)}
          loading={loading}
          selectedSession={selectedSession}
        />
      </div>
    </div>
  );
}
