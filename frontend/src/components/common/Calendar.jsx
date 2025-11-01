import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./calendar/Calendar.module.css";

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
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ value, onSelect }) => {
  const selectedDate = parseISO(value) || new Date();
  const today = new Date();

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
