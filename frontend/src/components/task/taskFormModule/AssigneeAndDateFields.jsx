import { X, Calendar as CalendarIcon } from "lucide-react";
import Input from "../../common/Input";
import { useEffect, useRef, useState } from "react";
import Calendar from "../../common/Calendar";
import styles from "./TaskForm.module.css";

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

  const handleSelectDate = (isoDateString) => {
    onChange({ target: { name: "dueDate", value: isoDateString } });
    setShowCalendar(false);
  };
  const handleSelectStartDate = (isoDateString) => {
    onChange({ target: { name: "startDate", value: isoDateString } });
    setShowStartCalendar(false);
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
                position: "absolute",
                zIndex: 20,
                top: "100%",
                marginTop: "0.25rem",
                right: 0,
              }}
            >
              <Calendar value={startDate} onSelect={handleSelectStartDate} />
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
                position: "absolute",
                zIndex: 20,
                top: "100%",
                marginTop: "0.25rem",
                right: 0,
              }}
            >
              <Calendar value={dueDate} onSelect={handleSelectDate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssigneeAndDateFields;
