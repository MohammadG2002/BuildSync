import { X, Calendar as CalendarIcon } from "lucide-react";
import Input from "../../common/Input";
import { useEffect, useRef, useState } from "react";
import Calendar from "../../common/Calendar";
import styles from "./TaskForm.module.css";

const AssigneeAndDateFields = ({
  assigneeIds = [],
  dueDate,
  onChange,
  members,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const dateWrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showCalendar) return;
      if (
        dateWrapperRef.current &&
        !dateWrapperRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  const handleSelectDate = (isoDateString) => {
    onChange({ target: { name: "dueDate", value: isoDateString } });
    setShowCalendar(false);
  };
  const handleAssigneeToggle = (memberId) => {
    const currentIds = Array.isArray(assigneeIds) ? assigneeIds : [];
    const newIds = currentIds.includes(memberId)
      ? currentIds.filter((id) => id !== memberId)
      : [...currentIds, memberId];

    // Create a synthetic event to match the onChange signature
    onChange({
      target: {
        name: "assigneeIds",
        value: newIds,
      },
    });
  };

  const getSelectedMembers = () => {
    const currentIds = Array.isArray(assigneeIds) ? assigneeIds : [];
    return members.filter((member) => currentIds.includes(member.id));
  };

  const getUnselectedMembers = () => {
    const currentIds = Array.isArray(assigneeIds) ? assigneeIds : [];
    return members.filter((member) => !currentIds.includes(member.id));
  };

  const selectedMembers = getSelectedMembers();
  const unselectedMembers = getUnselectedMembers();

  return (
    <div className={styles.gridTwo}>
      <div>
        <label className={styles.fieldLabel}>Assign To</label>
        <div className={styles.multiSelect}>
          {/* Selected members */}
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

          {/* Dropdown to add more */}
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleAssigneeToggle(e.target.value);
              }
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
            if ((e.key === "Enter" || e.key === "ArrowDown") && !showCalendar) {
              setShowCalendar(true);
              e.preventDefault();
            }
          }}
          onFocus={() => setShowCalendar(true)}
          onClick={() => setShowCalendar(true)}
          readOnly
          icon={CalendarIcon}
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
  );
};

export default AssigneeAndDateFields;
