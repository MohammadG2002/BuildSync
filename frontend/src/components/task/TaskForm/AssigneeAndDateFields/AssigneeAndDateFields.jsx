import { X, Calendar as CalendarIcon } from "lucide-react";
import Input from "../../../common/input/Input/Input";
import { useEffect, useRef, useState } from "react";
import Calendar from "../../../common/calendar/Calendar/Calendar";
import styles from "./AssigneeAndDateFields.module.css";

const AssigneeAndDateFields = ({
  assigneeIds = [],
  startDate,
  startTime,
  dueDate,
  dueTime,
  onChange,
  members,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startCalPos, setStartCalPos] = useState(null);
  const [dueCalPos, setDueCalPos] = useState(null);
  const dateWrapperRef = useRef(null);
  const startWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const startInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showCalendar &&
        dateWrapperRef.current &&
        !dateWrapperRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
      if (
        showStartCalendar &&
        startWrapperRef.current &&
        !startWrapperRef.current.contains(e.target)
      ) {
        setShowStartCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar, showStartCalendar]);

  // Compute fixed-position coordinates so the calendar can render above other
  // overflowed parents (modal overlays often create new stacking contexts).
  useEffect(() => {
    const compute = () => {
      try {
        if (startInputRef.current && showStartCalendar) {
          const r = startInputRef.current.getBoundingClientRect();
          let left = r.left;
          const estHeight = 360;
          let top = r.bottom + 6;
          // If the calendar would overflow the viewport bottom, flip it above
          if (r.bottom + 6 + estHeight > window.innerHeight) {
            top = r.top - estHeight - 6;
            if (top < 8) top = 8;
          }
          setStartCalPos({ left, top });
        } else {
          setStartCalPos(null);
        }
        if (inputRef.current && showCalendar) {
          const r = inputRef.current.getBoundingClientRect();
          let left = r.left;
          const estHeight = 360;
          let top = r.bottom + 6;
          if (r.bottom + 6 + estHeight > window.innerHeight) {
            top = r.top - estHeight - 6;
            if (top < 8) top = 8;
          }
          setDueCalPos({ left, top });
        } else {
          setDueCalPos(null);
        }
      } catch (e) {
        // ignore
      }
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute);
    };
  }, [showStartCalendar, showCalendar]);

  const handleSelectDate = (isoDateString) => {
    onChange({ target: { name: "dueDate", value: isoDateString } });
    setShowCalendar(false);
  };
  const handleSelectStartDate = (isoDateString) => {
    onChange({ target: { name: "startDate", value: isoDateString } });
    setShowStartCalendar(false);
  };
  // When a time is chosen from the calendar's time-presets/hours grid,
  // update both the date and the separate time fields used by TaskForm.
  const handleStartTimePreset = (date, time) => {
    // date is YYYY-MM-DD, time is HH:MM
    onChange({ target: { name: "startDate", value: date } });
    onChange({ target: { name: "startTime", value: time } });
    setShowStartCalendar(false);
  };
  const handleDueTimePreset = (date, time) => {
    onChange({ target: { name: "dueDate", value: date } });
    onChange({ target: { name: "dueTime", value: time } });
    setShowCalendar(false);
  };
  const handleAssigneeToggle = (memberId) => {
    const currentIds = Array.isArray(assigneeIds) ? assigneeIds : [];
    const newIds = currentIds.includes(memberId)
      ? currentIds.filter((id) => id !== memberId)
      : [...currentIds, memberId];

    onChange({
      target: {
        name: "assigneeIds",
        value: newIds,
      },
    });
  };

  const selectedMembers = members.filter((m) =>
    (assigneeIds || []).includes(m.id)
  );
  const unselectedMembers = members.filter(
    (m) => !(assigneeIds || []).includes(m.id)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label className={styles.fieldLabel}>Assign To</label>
        <div className={styles.multiSelect}>
          {selectedMembers.length > 0 && (
            <div className={styles.selectedMembers}>
              {selectedMembers.map((member) => (
                <div key={member.id} className={styles.selectedMemberTag}>
                  <span>{member.name}</span>
                  <button
                    type="button"
                    onClick={() => handleAssigneeToggle(member.id)}
                    className={styles.removeButton}
                    aria-label={`Remove ${member.name}`}
                  >
                    <X className={styles.removeIcon} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) handleAssigneeToggle(e.target.value);
            }}
            className={styles.select}
          >
            <option value="">
              {selectedMembers.length === 0
                ? "Select assignees..."
                : "Add more assignees..."}
            </option>
            {unselectedMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.gridTwo}>
        <div ref={startWrapperRef} style={{ position: "relative" }}>
          <Input
            ref={startInputRef}
            label="Start Date"
            type="text"
            name="startDate"
            value={startDate}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowStartCalendar(false);
                e.stopPropagation();
              }
              if (
                (e.key === "Enter" || e.key === "ArrowDown") &&
                !showStartCalendar
              ) {
                setShowStartCalendar(true);
                e.preventDefault();
              }
            }}
            onFocus={() => setShowStartCalendar(true)}
            onClick={() => setShowStartCalendar(true)}
            readOnly
            icon={CalendarIcon}
          />
          <Input
            label="Start Time"
            type="time"
            name="startTime"
            value={startTime}
            onChange={onChange}
            style={{ marginTop: 4 }}
          />
          {showStartCalendar && (
            <div
              style={{
                position: startCalPos ? "fixed" : "absolute",
                zIndex: 9999,
                left: startCalPos ? startCalPos.left : "auto",
                top: startCalPos ? startCalPos.top : "100%",
                marginTop: startCalPos ? 0 : "0.25rem",
                maxHeight: "60vh",
                overflowY: "auto",
                boxShadow: "0 12px 40px rgba(16,24,40,0.12)",
                borderRadius: 8,
                background: "var(--card-bg, #fff)",
              }}
            >
              <Calendar
                value={
                  startDate
                    ? startTime
                      ? `${startDate}T${startTime}`
                      : startDate
                    : startDate
                }
                onSelect={handleSelectStartDate}
                onTimePreset={handleStartTimePreset}
              />
            </div>
          )}
        </div>
        <div ref={dateWrapperRef} style={{ position: "relative" }}>
          <Input
            ref={inputRef}
            label="Due Date"
            type="text"
            name="dueDate"
            value={dueDate}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowCalendar(false);
                e.stopPropagation();
              }
              if (
                (e.key === "Enter" || e.key === "ArrowDown") &&
                !showCalendar
              ) {
                setShowCalendar(true);
                e.preventDefault();
              }
            }}
            onFocus={() => setShowCalendar(true)}
            onClick={() => setShowCalendar(true)}
            readOnly
            icon={CalendarIcon}
          />
          <Input
            label="Due Time"
            type="time"
            name="dueTime"
            value={dueTime}
            onChange={onChange}
            style={{ marginTop: 4 }}
          />
          {showCalendar && (
            <div
              style={{
                position: dueCalPos ? "fixed" : "absolute",
                zIndex: 9999,
                left: dueCalPos ? dueCalPos.left : "auto",
                top: dueCalPos ? dueCalPos.top : "100%",
                marginTop: dueCalPos ? 0 : "0.25rem",
                maxHeight: "60vh",
                overflowY: "auto",
                boxShadow: "0 12px 40px rgba(16,24,40,0.12)",
                borderRadius: 8,
                background: "var(--card-bg, #fff)",
              }}
            >
              <Calendar
                value={
                  dueDate
                    ? dueTime
                      ? `${dueDate}T${dueTime}`
                      : dueDate
                    : dueDate
                }
                onSelect={handleSelectDate}
                onTimePreset={handleDueTimePreset}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssigneeAndDateFields;
