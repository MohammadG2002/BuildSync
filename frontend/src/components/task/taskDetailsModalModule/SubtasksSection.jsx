import { useCallback, useRef, useState } from "react";
import styles from "./TaskDetailsModal.module.css";

// Lightweight UI-only subtasks section.
// Contract:
// - props.subtasks: Array<{ id: string, title: string, completed: boolean, editing?: boolean }>
// - onAdd(): void -> parent should push a new item with editing=true
// - onToggle(id): void
// - onChangeTitle(id, value): void
// - onCommit(id): void (called on blur/Enter). If title empty, parent may remove.
export default function SubtasksSection({
  subtasks = [],
  onAdd,
  onToggle,
  onChangeTitle,
  onCommit,
  onDelete,
  onStartEdit,
  readOnly = false,
}) {
  const hasEditing = subtasks.some((s) => !!s.editing);
  const togglingRef = useRef(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [isSavingEdits, setIsSavingEdits] = useState(false);

  const handleToggleEditMode = async () => {
    if (isEditingList) {
      // Finishing: commit all editing subtasks before leaving edit mode
      const editingIds = subtasks.filter((s) => s.editing).map((s) => s.id);
      if (editingIds.length > 0 && onCommit) {
        try {
          setIsSavingEdits(true);
          // Commit sequentially to keep ordering predictable
          for (const id of editingIds) {
            // onCommit may be sync or async
            const maybePromise = onCommit(id);
            if (maybePromise && typeof maybePromise.then === "function") {
              await maybePromise;
            }
          }
        } finally {
          setIsSavingEdits(false);
        }
      }
      setIsEditingList(false);
    } else {
      setIsEditingList(true);
    }
  };
  const handleKeyDown = useCallback(
    (e, id) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onCommit?.(id);
      } else if (e.key === "Escape") {
        e.currentTarget.blur();
      }
    },
    [onCommit]
  );

  return (
    <section>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Subtasks</h3>
        <button
          type="button"
          className={styles.addFileButton}
          onClick={onAdd}
          disabled={isSavingEdits || readOnly}
        >
          + Add Subtask
        </button>
        <button
          type="button"
          className={styles.editButton}
          onClick={handleToggleEditMode}
          disabled={isSavingEdits || readOnly}
        >
          {isEditingList ? "Done" : "Edit Subtasks"}
        </button>
      </div>

      {subtasks.length === 0 ? (
        <p className={styles.metadataTextMuted}>No subtasks yet.</p>
      ) : (
        <ul className={styles.subtasksList}>
          {subtasks.map((s) => (
            <li key={s.id} className={styles.subtaskItem}>
              <label className={styles.subtaskLabel}>
                <input
                  type="checkbox"
                  className={styles.subtaskCheckbox}
                  checked={!!s.completed}
                  onMouseDown={(e) => {
                    // If any subtask is in edit mode, prevent stealing focus (no blur/commit)
                    if (hasEditing || readOnly) {
                      e.preventDefault();
                    }
                    // leave the flag set by label
                  }}
                  disabled={hasEditing || readOnly}
                  onChange={() => onToggle?.(s.id)}
                  title={
                    hasEditing
                      ? "Finish editing subtasks to toggle"
                      : readOnly
                      ? "View only"
                      : undefined
                  }
                />
                {s.editing ? (
                  <input
                    autoFocus
                    className={styles.subtaskInput}
                    value={s.title || ""}
                    placeholder="Describe the subtask..."
                    onChange={(e) => onChangeTitle?.(s.id, e.target.value)}
                    // Do NOT auto-commit on blur; commit explicitly on Enter to avoid duplicate creates
                    onKeyDown={(e) => handleKeyDown(e, s.id)}
                  />
                ) : (
                  <span
                    className={
                      s.completed ? styles.subtaskTextDone : styles.subtaskText
                    }
                    onMouseDown={(e) => {
                      if (!isEditingList) return;
                      // Prevent label default (which toggles checkbox)
                      e.preventDefault();
                      e.stopPropagation();
                      if (!readOnly) onStartEdit?.(s.id);
                    }}
                    role={isEditingList ? "button" : undefined}
                    title={isEditingList ? "Click to edit" : undefined}
                  >
                    {s.title || "Untitled subtask"}
                  </span>
                )}
              </label>
              {isEditingList && !readOnly && (
                <div className={styles.subtaskActions}>
                  <button
                    type="button"
                    className={styles.subtaskDeleteButton}
                    onClick={() => onDelete?.(s.id)}
                    disabled={hasEditing || isSavingEdits}
                    aria-label="Delete subtask"
                    title={hasEditing ? "Finish editing to delete" : "Delete"}
                  >
                    −
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
