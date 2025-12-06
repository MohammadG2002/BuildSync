import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import Input from "../../../common/input/Input/Input";
import Calendar from "../../../common/calendar/Calendar/Calendar";
import styles from "./DateFields.module.css";

const DateFields = ({ startDate, dueDate, onChange, dueDateError }) => {
  const [showStartCal, setShowStartCal] = useState(false);
  const [showDueCal, setShowDueCal] = useState(false);
  const [startPos, setStartPos] = useState({
    top: 0,
    left: 0,
    placement: "bottom",
  });
  const [duePos, setDuePos] = useState({
    top: 0,
    left: 0,
    placement: "bottom",
  });
  const startRef = useRef(null);
  const dueRef = useRef(null);

  // Close calendars when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        showStartCal &&
        startRef.current &&
        !startRef.current.contains(e.target)
      ) {
        setShowStartCal(false);
      }
      if (showDueCal && dueRef.current && !dueRef.current.contains(e.target)) {
        setShowDueCal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showStartCal, showDueCal]);

  const handleSelect = (name) => (iso) => {
    onChange({ target: { name, value: iso } });
    if (name === "startDate") setShowStartCal(false);
    if (name === "dueDate") setShowDueCal(false);
  };

  // Compute viewport-safe popover position
  const computePosition = (anchorRect) => {
    const POPOVER_WIDTH = 320; // 20rem, matches Calendar.module.css
    const POPOVER_HEIGHT = 360; // approximate height
    const GAP = 4;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Preferred left aligns with input's left; clamp inside viewport with margin
    let left = Math.max(8, Math.min(anchorRect.left, vw - POPOVER_WIDTH - 8));

    // Prefer below; if it overflows bottom, flip above
    const bottomSpace = vh - anchorRect.bottom;
    const topSpace = anchorRect.top;
    let placement = "bottom";
    let top = anchorRect.bottom + GAP;
    if (bottomSpace < POPOVER_HEIGHT && topSpace > POPOVER_HEIGHT) {
      placement = "top";
      top = Math.max(8, anchorRect.top - POPOVER_HEIGHT - GAP);
    }

    return { top, left, placement };
  };

  // Recompute positions when opening or on resize/scroll
  useEffect(() => {
    const updatePositions = () => {
      if (showStartCal && startRef.current) {
        const rect = startRef.current.getBoundingClientRect();
        setStartPos(computePosition(rect));
      }
      if (showDueCal && dueRef.current) {
        const rect = dueRef.current.getBoundingClientRect();
        setDuePos(computePosition(rect));
      }
    };
    updatePositions();
    if (showStartCal || showDueCal) {
      window.addEventListener("resize", updatePositions);
      window.addEventListener("scroll", updatePositions, true);
      return () => {
        window.removeEventListener("resize", updatePositions);
        window.removeEventListener("scroll", updatePositions, true);
      };
    }
  }, [showStartCal, showDueCal]);

  return (
    <div className={styles.dateGrid}>
      <div ref={startRef} style={{ position: "relative" }}>
        <Input
          label="Start Date"
          type="text"
          name="startDate"
          value={startDate}
          onChange={onChange}
          onFocus={() => setShowStartCal(true)}
          onClick={() => setShowStartCal(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowStartCal(false);
              e.stopPropagation();
            }
            if ((e.key === "Enter" || e.key === "ArrowDown") && !showStartCal) {
              setShowStartCal(true);
              e.preventDefault();
            }
          }}
          readOnly
          icon={CalendarIcon}
        />
        {showStartCal &&
          createPortal(
            <div
              style={{
                position: "fixed",
                zIndex: 1000,
                top: `${startPos.top}px`,
                left: `${startPos.left}px`,
              }}
            >
              <Calendar
                value={startDate}
                onSelect={handleSelect("startDate")}
              />
            </div>,
            document.body
          )}
      </div>

      <div ref={dueRef} style={{ position: "relative" }}>
        <Input
          label="Due Date"
          type="text"
          name="dueDate"
          value={dueDate}
          onChange={onChange}
          onFocus={() => setShowDueCal(true)}
          onClick={() => setShowDueCal(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowDueCal(false);
              e.stopPropagation();
            }
            if ((e.key === "Enter" || e.key === "ArrowDown") && !showDueCal) {
              setShowDueCal(true);
              e.preventDefault();
            }
          }}
          readOnly
          icon={CalendarIcon}
          error={dueDateError}
        />
        {showDueCal &&
          createPortal(
            <div
              style={{
                position: "fixed",
                zIndex: 1000,
                top: `${duePos.top}px`,
                left: `${duePos.left}px`,
              }}
            >
              <Calendar value={dueDate} onSelect={handleSelect("dueDate")} />
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default DateFields;
