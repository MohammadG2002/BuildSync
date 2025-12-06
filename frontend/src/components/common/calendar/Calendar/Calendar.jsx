import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Calendar.module.css";

function pad(n) {
  return String(n).padStart(2, "0");
}

function toISO(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

function parseISO(iso) {
  if (!iso) return null;
  // Accept either a date-only ISO (YYYY-MM-DD) or a full datetime (YYYY-MM-DDTHH:MM)
  const dateOnly = iso.includes("T") ? iso.split("T")[0] : iso;
  const [y, m, d] = dateOnly.split("-").map((s) => parseInt(s, 10));
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ value, onSelect, onTimePreset }) => {
  const selectedDate = parseISO(value) || new Date();
  const today = new Date();

  const [customTime, setCustomTime] = useState(() => {
    try {
      if (value && value.includes("T")) {
        // Parse the incoming ISO (which may be UTC with a Z or include an offset)
        // and show it in the user's local wall-clock time (hours:minutes).
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          const hh = String(d.getHours()).padStart(2, "0");
          const mm = String(d.getMinutes()).padStart(2, "0");
          return `${hh}:${mm}`;
        }
      }
    } catch {}
    return "08:00";
  });
  // Keep customTime in sync when the parent passes a new value (e.g. when reopening)
  useEffect(() => {
    try {
      if (value && value.includes("T")) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          const hh = String(d.getHours()).padStart(2, "0");
          const mm = String(d.getMinutes()).padStart(2, "0");
          setCustomTime(`${hh}:${mm}`);
          return;
        }
        // fallback to naive split if Date parsing fails
        setCustomTime(value.split("T")[1].slice(0, 5));
        return;
      }
    } catch {}
    // otherwise keep existing customTime or default
  }, [value]);
  const [showHours, setShowHours] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const monthLabel = currentMonth.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIdx = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // previous month tail
    const prevMonthDays = new Date(year, month, 0).getDate();
    const grid = [];

    // Fill leading days from previous month to align week start (Sun)
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      grid.push({
        date: new Date(year, month - 1, dayNum),
        inCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({ date: new Date(year, month, d), inCurrentMonth: true });
    }

    // Trailing days from next month to make 6 rows (42 cells)
    while (grid.length % 7 !== 0) {
      const nextIndex = grid.length - (firstDayIdx + daysInMonth) + 1;
      grid.push({
        date: new Date(year, month + 1, nextIndex),
        inCurrentMonth: false,
      });
    }
    while (grid.length < 42) {
      const last = grid[grid.length - 1].date;
      grid.push({
        date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
        inCurrentMonth: false,
      });
    }

    return grid;
  }, [currentMonth]);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const goPrev = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goNext = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          onClick={goPrev}
          className={styles.iconCircle}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className={styles.monthLabel}>{monthLabel}</div>
        <button
          type="button"
          onClick={goNext}
          className={styles.iconCircle}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={styles.weekHeader}>
        {dayNames.map((d) => (
          <div key={d} className={styles.weekDay}>
            {d}
          </div>
        ))}
      </div>
      <div className={styles.grid}>
        {days.map(({ date: dt, inCurrentMonth }) => {
          const isToday = isSameDay(dt, today);
          const isSelected = value && isSameDay(dt, selectedDate);
          return (
            <button
              key={toISO(dt)}
              type="button"
              className={[
                styles.day,
                !inCurrentMonth ? styles.muted : "",
                isToday ? styles.today : "",
                isSelected ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelect?.(toISO(dt))}
            >
              {dt.getDate()}
            </button>
          );
        })}
      </div>
      {onTimePreset && (
        <div className={styles.timeRow}>
          <div className={styles.timeLabel}>Quick times</div>
          <div className={styles.timeBtns}>
            {["08:00", "12:00", "17:00", "20:00"].map((t) => (
              <button
                key={t}
                type="button"
                className={styles.timeBtn}
                onClick={() => onTimePreset?.(toISO(selectedDate), t)}
              >
                {t}
              </button>
            ))}
            <input
              className={styles.timeInput}
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
            <button
              type="button"
              className={styles.timeApply}
              onClick={() => onTimePreset?.(toISO(selectedDate), customTime)}
            >
              Apply
            </button>
            <div style={{ marginLeft: 8 }}>
              <button
                type="button"
                className={styles.timeBtn}
                onClick={() => setShowHours((s) => !s)}
              >
                {showHours ? "Hide hours" : "Show hours"}
              </button>
            </div>
          </div>
        </div>
      )}
      {onTimePreset && showHours && (
        <div
          className={styles.hoursGrid}
          style={{ padding: 12, background: "#eaf6ff", borderRadius: "10px" }}
        >
          {Array.from({ length: 24 }).map((_, h) => {
            const hh = String(h).padStart(2, "0");
            const label = `${hh}:00`;
            const selectedHour = (customTime || "").slice(0, 2);
            const isSelected = selectedHour === hh;
            const btnStyle = isSelected
              ? {
                  background: "linear-gradient(180deg,#2563eb 0%,#1d4ed8 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 30px rgba(37,99,235,0.18)",
                  transform: "translateY(-6px)",
                }
              : { background: "#fff" };
            return (
              <button
                key={h}
                type="button"
                aria-pressed={isSelected}
                className={styles.hourCell}
                style={{ ...btnStyle, height: 44, fontSize: 15 }}
                onClick={() => {
                  const time = `${hh}:00`;
                  setCustomTime(time);
                  onTimePreset?.(toISO(selectedDate), time);
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => onSelect?.("")}
        >
          Clear
        </button>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => onSelect?.(toISO(today))}
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default Calendar;
