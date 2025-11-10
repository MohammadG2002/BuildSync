import { useEffect, useRef, useState, useMemo } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import Input from "../../common/Input";
import Calendar from "../../common/Calendar";
import styles from "../taskFormModule/TaskForm.module.css";

const TimeSchedulingSection = ({ task, onUpdate, readOnly = false }) => {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showDueCalendar, setShowDueCalendar] = useState(false);
  const startRef = useRef(null);
  const dueRef = useRef(null);
  const startWrapRef = useRef(null);
  const dueWrapRef = useRef(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loadingSched, setLoadingSched] = useState(false);
  const [schedError, setSchedError] = useState("");

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        showStartCalendar &&
        startWrapRef.current &&
        !startWrapRef.current.contains(e.target)
      ) {
        setShowStartCalendar(false);
      }
      if (
        showDueCalendar &&
        dueWrapRef.current &&
        !dueWrapRef.current.contains(e.target)
      ) {
        setShowDueCalendar(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showStartCalendar, showDueCalendar]);

  const startDate = task?.startDate ? task.startDate.split("T")[0] : "";
  const dueDate = task?.dueDate ? task.dueDate.split("T")[0] : "";
  // Prefer explicit times from the task's ISO datetimes where available.
  // When the server returns a UTC ISO (or one with an offset), derive the
  // user's local wall-clock HH:MM so the standalone time inputs show the
  // expected local time instead of a raw UTC substring.
  let startTime = undefined;
  let dueTime = undefined;
  if (task?.startDate && task.startDate.includes("T")) {
    try {
      const d = new Date(task.startDate);
      if (!isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        startTime = `${hh}:${mm}`;
      }
    } catch {}
    // fallback to naive substring if parsing fails
    if (!startTime)
      startTime = task.startDate.split("T")[1]?.slice(0, 5) || undefined;
  }
  if (task?.dueDate && task.dueDate.includes("T")) {
    try {
      const d = new Date(task.dueDate);
      if (!isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        dueTime = `${hh}:${mm}`;
      }
    } catch {}
    if (!dueTime)
      dueTime = task.dueDate.split("T")[1]?.slice(0, 5) || undefined;
  }

  // Apply defaults only when no explicit time was provided on the task.
  // If the start and due are the same date, prefer an 08:00 -> 20:00 window.
  // Otherwise default to 08:00 -> 08:00 across days.
  if (!startTime && !dueTime) {
    if (startDate && startDate === dueDate) {
      startTime = "08:00";
      dueTime = "20:00";
    } else {
      startTime = "08:00";
      dueTime = "08:00";
    }
  } else {
    // If only one of them is missing, give it a sensible default.
    if (!startTime) startTime = startDate === dueDate ? "08:00" : "08:00";
    if (!dueTime) dueTime = startDate === dueDate ? "20:00" : "08:00";
  }

  // --- Load all project tasks (for schedule calculations) ---
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!task?.project) return;
      try {
        setLoadingSched(true);
        setSchedError("");
        const { getTasks } = await import("../../../services/taskService");
        const wsId =
          typeof task.workspace === "object"
            ? task.workspace._id
            : task.workspace;
        const prId =
          typeof task.project === "object" ? task.project._id : task.project;
        const list = await getTasks(wsId, prId);
        if (!cancelled) setProjectTasks(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Schedule tasks load failed", e);
        if (!cancelled) {
          setSchedError("Failed to load project tasks for schedule analysis");
          setProjectTasks([]);
        }
      } finally {
        if (!cancelled) setLoadingSched(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [task?._id, task?.project, task?.workspace]);

  // --- Scheduling Computations (CPM-like) ---
  const scheduleMetrics = useMemo(() => {
    // Build a simplified graph.
    const tasks = projectTasks;
    if (!Array.isArray(tasks) || tasks.length === 0) return null;

    const msPerDay = 1000 * 60 * 60 * 24;
    const toDay = (d) => {
      if (!d) return null;
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return null;
        // normalize midnight
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
      } catch {
        return null;
      }
    };
    // Map id -> node info
    const nodes = new Map();
    tasks.forEach((t) => {
      const id = t._id || t.id;
      const s = toDay(t.startDate);
      const d = toDay(t.dueDate);
      let durationDays = 1; // minimum 1 day
      if (s && d) {
        const diff = Math.ceil((d.getTime() - s.getTime()) / msPerDay) + 1; // inclusive
        if (!isNaN(diff) && diff > 0) durationDays = diff;
      }
      nodes.set(id.toString(), {
        id: id.toString(),
        raw: t,
        start: s,
        due: d,
        duration: durationDays,
        deps: (t.dependencies || []).map((dep) => {
          if (typeof dep === "string") return dep;
          return dep?._id || dep?.id || dep;
        }),
        successors: [],
        ES: 0,
        EF: 0,
        LS: 0,
        LF: 0,
        slack: 0,
      });
    });
    // Build successors
    nodes.forEach((n) => {
      n.deps.forEach((dId) => {
        const depNode = nodes.get(dId?.toString());
        if (depNode) depNode.successors.push(n.id);
      });
    });

    // Kahn topological order
    const inDegree = new Map();
    nodes.forEach((n) => inDegree.set(n.id, 0));
    nodes.forEach((n) =>
      n.deps.forEach((d) => inDegree.set(n.id, (inDegree.get(n.id) || 0) + 1))
    );
    const queue = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });
    const topo = [];
    while (queue.length) {
      const id = queue.shift();
      topo.push(id);
      const node = nodes.get(id);
      node.successors.forEach((sId) => {
        inDegree.set(sId, inDegree.get(sId) - 1);
        if (inDegree.get(sId) === 0) queue.push(sId);
      });
    }
    // If cycle (topo smaller), fall back by adding remaining nodes arbitrarily
    if (topo.length < nodes.size) {
      nodes.forEach((_, id) => {
        if (!topo.includes(id)) topo.push(id);
      });
    }

    // Forward pass
    topo.forEach((id) => {
      const n = nodes.get(id);
      let es = 0;
      n.deps.forEach((dId) => {
        const dep = nodes.get(dId.toString());
        if (dep) es = Math.max(es, dep.EF);
      });
      // If task has an explicit start date, anchor ES to that absolute day offset relative to project start.
      // Determine project base date (earliest explicit start among tasks)
      n.ES = es;
      n.EF = es + n.duration;
    });
    // Determine project duration end
    const projectEnd = Math.max(...Array.from(nodes.values()).map((n) => n.EF));
    // Backward pass
    for (let i = topo.length - 1; i >= 0; i--) {
      const id = topo[i];
      const n = nodes.get(id);
      if (n.successors.length === 0) {
        n.LF = projectEnd;
        n.LS = n.LF - n.duration;
      } else {
        let lf = Infinity;
        n.successors.forEach((sId) => {
          const s = nodes.get(sId);
          if (s) lf = Math.min(lf, s.LS);
        });
        if (!isFinite(lf)) lf = projectEnd; // fallback
        n.LF = lf;
        n.LS = lf - n.duration;
      }
      n.slack = n.LS - n.ES;
    }

    const currentId = (task?._id || task?.id || "").toString();
    const cur = nodes.get(currentId);
    if (!cur) return null;

    // Determine dependency finish warnings
    const depWarnings = [];
    cur.deps.forEach((dId) => {
      const dn = nodes.get(dId.toString());
      if (!dn) return;
      const depDue = dn.raw?.dueDate || dn.raw?.due || dn.raw?.dueDate; // prefer actual due
      // Compare actual calendar dates if both have explicit start/due
      if (task.startDate && dn.raw?.dueDate) {
        try {
          const tStart = toDay(task.startDate);
          const dFinish = toDay(dn.raw.dueDate);
          if (tStart && dFinish && tStart.getTime() < dFinish.getTime()) {
            depWarnings.push({
              depId: dn.id,
              title: dn.raw.title || `Task ${dn.id}`,
              finish: dFinish.toISOString().split("T")[0],
            });
          }
        } catch {
          /* ignore */
        }
      }
    });

    return {
      ES: cur.ES,
      EF: cur.EF,
      LS: cur.LS,
      LF: cur.LF,
      slack: cur.slack,
      duration: cur.duration,
      depWarnings,
    };
  }, [projectTasks, task]);

  const handleSelectStartDate = (isoDate) => {
    if (readOnly) return;
    // Combine date with existing time and include local timezone offset
    const tzOffset = (() => {
      const mins = -new Date().getTimezoneOffset();
      const sign = mins >= 0 ? "+" : "-";
      const a = Math.abs(mins);
      return `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(
        a % 60
      ).padStart(2, "0")}`;
    })();
    const dateTime = `${isoDate}T${startTime}:00${tzOffset}`;
    onUpdate?.({ _id: task._id, startDate: dateTime });
    setShowStartCalendar(false);
  };
  const handleSelectDueDate = (isoDate) => {
    if (readOnly) return;
    // Combine date with existing time and include local timezone offset
    const tzOffset = (() => {
      const mins = -new Date().getTimezoneOffset();
      const sign = mins >= 0 ? "+" : "-";
      const a = Math.abs(mins);
      return `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(
        a % 60
      ).padStart(2, "0")}`;
    })();
    const dateTime = `${isoDate}T${dueTime}:00${tzOffset}`;
    onUpdate?.({ _id: task._id, dueDate: dateTime });
    setShowDueCalendar(false);
  };

  return (
    <div className={styles.form}>
      <div
        style={{
          background: "var(--card-bg, #ffffff)",
          border: "1px solid #e6e9ee",
          borderRadius: 8,
          padding: "0.75rem",
          boxShadow: "0 1px 3px rgba(16,24,40,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {/* Warning about dependency start constraints */}
        {scheduleMetrics?.depWarnings?.length > 0 && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "0.75rem 1rem",
              borderRadius: 6,
              color: "#b91c1c",
              fontSize: ".85rem",
            }}
          >
            <strong>Dependency Warning:</strong> This task starts before the
            completion of:
            <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.25rem" }}>
              {scheduleMetrics.depWarnings.map((w) => (
                <li key={w.depId}>
                  {w.title} (finishes {w.finish})
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.gridTwo}>
          <div
            ref={startWrapRef}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              ref={startRef}
              label="Start Date"
              type="text"
              name="startDate"
              value={startDate}
              onChange={() => {}}
              onFocus={() => !readOnly && setShowStartCalendar(true)}
              onClick={() => !readOnly && setShowStartCalendar(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowStartCalendar(false);
                  e.stopPropagation();
                }
                if ((e.key === "Enter" || e.key === "ArrowDown") && !readOnly) {
                  setShowStartCalendar(true);
                  e.preventDefault();
                }
              }}
              readOnly
              icon={CalendarIcon}
            />
            <div style={{ marginTop: 6 }}>
              <Input
                label="Start Time"
                type="time"
                name="startTime"
                value={startTime}
                onChange={(e) => {
                  if (readOnly) return;
                  // Determine a reliable date part to attach the new time to and include timezone
                  const datePart =
                    startDate ||
                    (task?.startDate ? task.startDate.split("T")[0] : null) ||
                    (task?.dueDate ? task.dueDate.split("T")[0] : null) ||
                    new Date().toISOString().split("T")[0];
                  const mins = -new Date().getTimezoneOffset();
                  const sign = mins >= 0 ? "+" : "-";
                  const a = Math.abs(mins);
                  const tz = `${sign}${String(Math.floor(a / 60)).padStart(
                    2,
                    "0"
                  )}:${String(a % 60).padStart(2, "0")}`;
                  const dateTime = `${datePart}T${e.target.value}:00${tz}`;
                  onUpdate?.({ _id: task._id, startDate: dateTime });
                }}
                style={{ marginTop: 0 }}
                readOnly={readOnly}
              />
            </div>
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
                <Calendar
                  // pass the full ISO datetime when available so the calendar can show the selected time
                  value={task?.startDate || startDate}
                  onSelect={handleSelectStartDate}
                  onTimePreset={(date, time) => {
                    if (readOnly) return;
                    const mins = -new Date().getTimezoneOffset();
                    const sign = mins >= 0 ? "+" : "-";
                    const a = Math.abs(mins);
                    const tz = `${sign}${String(Math.floor(a / 60)).padStart(
                      2,
                      "0"
                    )}:${String(a % 60).padStart(2, "0")}`;
                    onUpdate?.({
                      _id: task._id,
                      startDate: `${date}T${time}:00${tz}`,
                    });
                    setShowStartCalendar(false);
                  }}
                />
              </div>
            )}
          </div>
          <div
            ref={dueWrapRef}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              ref={dueRef}
              label="Due Date"
              type="text"
              name="dueDate"
              value={dueDate}
              onChange={() => {}}
              onFocus={() => !readOnly && setShowDueCalendar(true)}
              onClick={() => !readOnly && setShowDueCalendar(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowDueCalendar(false);
                  e.stopPropagation();
                }
                if ((e.key === "Enter" || e.key === "ArrowDown") && !readOnly) {
                  setShowDueCalendar(true);
                  e.preventDefault();
                }
              }}
              readOnly
              icon={CalendarIcon}
            />
            <div style={{ marginTop: 6 }}>
              <Input
                label="Due Time"
                type="time"
                name="dueTime"
                value={dueTime}
                onChange={(e) => {
                  if (readOnly) return;
                  const datePart =
                    dueDate ||
                    (task?.dueDate ? task.dueDate.split("T")[0] : null) ||
                    (task?.startDate ? task.startDate.split("T")[0] : null) ||
                    new Date().toISOString().split("T")[0];
                  const mins = -new Date().getTimezoneOffset();
                  const sign = mins >= 0 ? "+" : "-";
                  const a = Math.abs(mins);
                  const tz = `${sign}${String(Math.floor(a / 60)).padStart(
                    2,
                    "0"
                  )}:${String(a % 60).padStart(2, "0")}`;
                  const dateTime = `${datePart}T${e.target.value}:00${tz}`;
                  onUpdate?.({ _id: task._id, dueDate: dateTime });
                }}
                style={{ marginTop: 0 }}
                readOnly={readOnly}
              />
            </div>
            {showDueCalendar && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 20,
                  top: "100%",
                  marginTop: "0.25rem",
                  right: 0,
                }}
              >
                <Calendar
                  // pass the full ISO datetime when available so the calendar can show the selected time
                  value={task?.dueDate || dueDate}
                  onSelect={handleSelectDueDate}
                  onTimePreset={(date, time) => {
                    if (readOnly) return;
                    const mins = -new Date().getTimezoneOffset();
                    const sign = mins >= 0 ? "+" : "-";
                    const a = Math.abs(mins);
                    const tz = `${sign}${String(Math.floor(a / 60)).padStart(
                      2,
                      "0"
                    )}:${String(a % 60).padStart(2, "0")}`;
                    onUpdate?.({
                      _id: task._id,
                      dueDate: `${date}T${time}:00${tz}`,
                    });
                    setShowDueCalendar(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <p style={{ color: "#6b7280", fontSize: ".875rem" }}>
        Tip: Start and Due dates also show in Overview. Changes save instantly.
      </p>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "0.75rem" }}>
        <h4 className={styles.fieldLabel} style={{ margin: 0 }}>
          Schedule Analysis
        </h4>
        {loadingSched && (
          <p style={{ color: "#6b7280", fontSize: ".8rem" }}>
            Loading project tasks…
          </p>
        )}
        {schedError && (
          <p style={{ color: "#b91c1c", fontSize: ".8rem" }}>{schedError}</p>
        )}
        {!loadingSched && !schedError && scheduleMetrics && (
          <div
            style={{
              marginTop: "0.5rem",
              display: "grid",
              gap: 4,
              fontSize: ".8rem",
            }}
          >
            <div>
              <strong>Early Start (ES):</strong> {scheduleMetrics.ES}
            </div>
            <div>
              <strong>Early Finish (EF):</strong> {scheduleMetrics.EF}
            </div>
            <div>
              <strong>Late Start (LS):</strong> {scheduleMetrics.LS}
            </div>
            <div>
              <strong>Late Finish (LF):</strong> {scheduleMetrics.LF}
            </div>
            <div>
              <strong>Slack Time:</strong> {scheduleMetrics.slack} day(s)
            </div>
            <div>
              <strong>Duration (est.):</strong> {scheduleMetrics.duration}{" "}
              day(s)
            </div>
            <p style={{ color: "#6b7280", margin: "0.35rem 0 0" }}>
              Values in day units relative to project network ordering. Slack 0
              indicates a critical task.
            </p>
          </div>
        )}
        {!loadingSched && !schedError && !scheduleMetrics && (
          <p style={{ color: "#6b7280", fontSize: ".8rem" }}>
            Not enough data to compute schedule metrics.
          </p>
        )}
      </div>
    </div>
  );
};

export default TimeSchedulingSection;
