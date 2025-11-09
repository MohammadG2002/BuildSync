import { useState, useRef, useEffect } from "react";
import {
  TaskCheckbox,
  TaskMenu,
  TaskTitle,
  TaskDescription,
  TaskProgress,
} from "./taskCardModule";
import styles from "./taskCardModule/TaskCard.module.css";
import { formatDate, getRelativeTime } from "../../utils/helpers";
import useWorkspaceTags from "../../hooks/useWorkspaceTags";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onClick,
  readOnly = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e) => {
    if (
      e.target.closest(".menu-button") ||
      e.target.closest(".menu-dropdown") ||
      e.target.closest(".checkbox-wrapper")
    ) {
      return;
    }
    onClick?.(task);
  };

  // Map task status to badge style classes
  const statusClasses = {
    todo: styles.statusTodo,
    "in-progress": styles.statusInProgress,
    review: styles.statusReview,
    completed: styles.statusCompleted,
    blocked: styles.statusBlocked,
  };

  const priorityTextClasses = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
  };
  const computeDurationLabel = (task) => {
    if (!task) return null;
    const rawStart = task.startDate || task.start;
    const rawDue = task.dueDate || task.due;
    if (!rawStart || !rawDue) return null;

    // Use separate time fields when available (form stores startTime/dueTime)
    const startTimeField = task.startTime || task.start_time || task.startAt;
    const dueTimeField = task.dueTime || task.due_time || task.dueAt;

    const buildDateTime = (dateStr, timeField) => {
      if (!dateStr) return null;
      // if already contains time, use as-is
      if (typeof dateStr === "string" && dateStr.includes("T")) return dateStr;
      // if time provided separately, combine
      if (timeField && typeof timeField === "string") {
        return `${dateStr}T${timeField}`;
      }
      return dateStr;
    };

    const startStr = buildDateTime(rawStart, startTimeField);
    const dueStr = buildDateTime(rawDue, dueTimeField);

    // Robust parser: support 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:MM' (with optional seconds/timezone)
    const parseToLocal = (v) => {
      if (!v) return null;
      if (typeof v !== "string") return new Date(v);
      // If contains 'T', split date and time and construct local Date
      if (v.includes("T")) {
        const [datePart, timePart] = v.split("T");
        const [y, m, day] = datePart.split("-").map((x) => parseInt(x, 10));
        if (!y || !m || !day) return new Date(v);
        // extract HH:MM from timePart (ignore seconds and timezone offset)
        const tm = (timePart || "").match(/^(\d{2}):(\d{2})/);
        const hh = tm ? parseInt(tm[1], 10) : 0;
        const mm = tm ? parseInt(tm[2], 10) : 0;
        return new Date(y, m - 1, day, hh, mm);
      }
      // date-only YYYY-MM-DD -> local midnight
      const parts = v.split("-").map((x) => parseInt(x, 10));
      if (parts.length === 3) {
        const [y, m, day] = parts;
        return new Date(y, m - 1, day, 0, 0);
      }
      return new Date(v);
    };

    const start = parseToLocal(startStr);
    const due = parseToLocal(dueStr);
    if (isNaN(start.getTime()) || isNaN(due.getTime())) return null;
    let ms = due.getTime() - start.getTime();
    if (ms < 0) return null;
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;
    const minuteMs = 60 * 1000;
    const days = Math.floor(ms / dayMs);
    ms -= days * dayMs;
    const hours = Math.floor(ms / hourMs);
    ms -= hours * hourMs;
    const minutes = Math.floor(ms / minuteMs);
    // Format like '7d - 12h 30m' (omit minutes if zero)
    // If result is zero (likely because times were missing), try fallback: extract HH:MM from raw strings
    if (days === 0 && hours === 0 && minutes === 0) {
      const timeRegex = /(\d{1,2}):(\d{2})/g;
      const getFirstTime = (str) => {
        if (!str) return null;
        const m = timeRegex.exec(str);
        timeRegex.lastIndex = 0;
        if (m) return { hh: parseInt(m[1], 10), mm: parseInt(m[2], 10) };
        return null;
      };
      const startTimeMatch = getFirstTime(rawStart);
      const dueTimeMatch = getFirstTime(rawDue);
      if (startTimeMatch && dueTimeMatch) {
        // Build datetime objects using the date parts from earlier parsing
        const startDT = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          startTimeMatch.hh,
          startTimeMatch.mm
        );
        const dueDT = new Date(
          due.getFullYear(),
          due.getMonth(),
          due.getDate(),
          dueTimeMatch.hh,
          dueTimeMatch.mm
        );
        let diff = dueDT.getTime() - startDT.getTime();
        if (diff >= 0) {
          const mins = Math.floor(diff / 60000);
          const dd = Math.floor(mins / (60 * 24));
          const hh = Math.floor((mins % (60 * 24)) / 60);
          const mm = mins % 60;
          const hPart = `${hh}h${mm ? ` ${mm}m` : ""}`;
          return `${dd}d - ${hPart}`;
        }
      }
    }
    const hoursPart = `${hours}h${minutes ? ` ${minutes}m` : ""}`;
    return `${days}d - ${hoursPart}`;
  };

  // Access tag definitions for color styling
  const { tagMap } = useWorkspaceTags();

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.cardContent}>
        <TaskCheckbox
          checked={task.status === "completed"}
          onChange={(e) => {
            e.stopPropagation();
            if (!readOnly) {
              onStatusChange?.(task, e.target.checked ? "completed" : "todo");
            }
          }}
          disabled={readOnly}
        />

        <div className={styles.contentArea}>
          <div className={styles.header}>
            <TaskTitle
              title={task.title}
              completed={task.status === "completed"}
              sequence={task.sequence}
            />
            <div className={styles.headerRight}>
              {/* Status Badge on the right */}
              <span
                className={`${styles.statusBadge} ${
                  statusClasses[task.status] || styles.statusTodo
                }`}
              >
                {String(task.status || "todo").replace(/-/g, " ")}
              </span>
              {/* Duration badge next to status */}
              {computeDurationLabel(task) && (
                <span
                  style={{
                    marginLeft: 8,
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "#eef2ff",
                    color: "#1e3a8a",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    display: "inline-block",
                  }}
                >
                  {computeDurationLabel(task)}
                </span>
              )}
              {!readOnly && (
                <div ref={menuRef}>
                  <TaskMenu
                    showMenu={showMenu}
                    onToggle={() => setShowMenu(!showMenu)}
                    onEdit={(t) => {
                      onEdit(t);
                      setShowMenu(false);
                    }}
                    onDelete={(t) => {
                      onDelete(t);
                      setShowMenu(false);
                    }}
                    task={task}
                  />
                </div>
              )}
            </div>
          </div>

          <TaskDescription description={task.description} />
          {/* Subtasks progress bar (only if subtasks exist) */}
          <TaskProgress
            taskId={task._id}
            subtasks={Array.isArray(task?.subtasks) ? task.subtasks : []}
          />

          {/* Priority − Due date row */}
          <div className={styles.priorityDueRow}>
            {task.priority && (
              <span
                className={`${styles.priorityText} ${
                  priorityTextClasses[task.priority]
                }`}
              >
                {task.priority}
              </span>
            )}
            {(task.startDate || task.dueDate) && (
              <span className={styles.bulletSeparator}>−</span>
            )}
            {(task.startDate || task.dueDate) && (
              <span className={styles.dueDateText}>
                {task.startDate ? formatDate(task.startDate) : ""}
                {task.startDate && task.dueDate && (
                  <span style={{ margin: "0 4px" }}>→</span>
                )}
                {task.dueDate ? formatDate(task.dueDate) : ""}
              </span>
            )}
          </div>

          {/* Tags row (new line below priority) */}
          {Array.isArray(task.tags) && task.tags.length > 0 && (
            <div className={styles.tagsRow}>
              {task.tags.map((tag) => {
                const def = tagMap.get(tag);
                const style = def
                  ? {
                      backgroundColor: def.backgroundColor || undefined,
                      color: def.color || undefined,
                      borderColor: "rgba(0,0,0,0.06)",
                    }
                  : undefined;
                return (
                  <span key={tag} className={styles.tagChip} style={style}>
                    {tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* Bottom metadata row: #sequence . Creator - opened <relative> */}
          <div className={styles.bottomRow}>
            {typeof task.sequence === "number" && task.sequence > 0 && (
              <span className={styles.bottomMuted}>{`#${task.sequence}`}</span>
            )}
            {typeof task.sequence === "number" && task.sequence > 0 && (
              <span className={styles.dotSeparator}>.</span>
            )}
            {task?.createdBy?.name && (
              <span className={styles.bottomMuted}>{task.createdBy.name}</span>
            )}
            {(task?.createdBy?.name ||
              (typeof task.sequence === "number" && task.sequence > 0)) && (
              <span className={styles.bulletSeparator}>-</span>
            )}
            {task?.createdAt && (
              <span className={styles.bottomMuted}>{`opened ${getRelativeTime(
                task.createdAt
              )}`}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
