import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatSessionSidebar.module.css";

export default function ChatSessionSidebar({
  sessions,
  selectedSession,
  loadingSessions,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
}) {
  const [menuOpen, setMenuOpen] = useState(null); // session id for open menu
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sessionsContainer}>
        <div className={styles.sidebarHeader}>
          <strong>Sessions</strong>
          <button className={styles.newSessionBtn} onClick={onNewSession}>
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
                  <div key={id} className={styles.sessionRow}>
                    <button
                      className={
                        id === selectedSession
                          ? styles.sessionSelectedSidebar
                          : styles.sessionBtnSidebar
                      }
                      onClick={() => onSelectSession(id)}
                    >
                      {s?.name ||
                        String(id).replace("session-", "Session ") ||
                        "Unnamed Session"}
                    </button>
                    <div className={styles.sessionMenuWrapper}>
                      <button
                        className={styles.sessionMenuBtn}
                        title="Session options"
                        onClick={() => setMenuOpen(menuOpen === id ? null : id)}
                      >
                        &#x22EE;
                      </button>
                      {menuOpen === id && (
                        <div
                          className={styles.sessionMenuDropdown}
                          ref={menuRef}
                        >
                          <button
                            className={styles.sessionMenuItem}
                            onClick={() => {
                              setMenuOpen(null);
                              if (onRenameSession) onRenameSession(id);
                            }}
                          >
                            Rename
                          </button>
                          <button
                            className={styles.sessionMenuItem}
                            onClick={() => {
                              setMenuOpen(null);
                              onDeleteSession(id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
