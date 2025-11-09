import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasks } from "../../services/taskService";

const ProjectGantt = () => {
  const { workspaceId, projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(24); // pixels per day

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const list = await getTasks(workspaceId, projectId);
        if (!cancelled) setTasks(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load tasks");
          setTasks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId, projectId]);

  const parsed = useMemo(() => {
    const toDate = (s) => {
      if (!s) return null;
      const d = new Date(s);
      if (isNaN(d.getTime())) return null;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };
    let items = (tasks || []).map((t) => {
      const id = t._id || t.id;
      const title = `${t.sequence ? `#${t.sequence} ` : ""}${
        t.title || "Untitled"
      }`;
      const start = toDate(t.startDate);
      const due = toDate(t.dueDate);
      return { id, title, start, due };
    });
    // Sort ascending by start date, then due date
    items = items.sort((a, b) => {
      if (!a.start && !b.start) return 0;
      if (!a.start) return 1;
      if (!b.start) return -1;
      if (a.start.getTime() !== b.start.getTime()) {
        return a.start.getTime() - b.start.getTime();
      }
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due.getTime() - b.due.getTime();
    });
    const dated = items.filter((i) => i.start && i.due);
    const min = dated.length
      ? new Date(Math.min(...dated.map((i) => i.start.getTime())))
      : null;
    const max = dated.length
      ? new Date(Math.max(...dated.map((i) => i.due.getTime())))
      : null;
    const dayCount =
      min && max
        ? Math.max(1, Math.ceil((max - min) / (1000 * 60 * 60 * 24)) + 1)
        : 1;
    return { items, dated, min, max, dayCount };
  }, [tasks]);

  const headerDays = useMemo(() => {
    if (!parsed.min || !parsed.max) return [];
    const days = [];
    const cur = new Date(parsed.min);
    while (cur.getTime() <= parsed.max.getTime()) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [parsed.min, parsed.max]);

  const dayIndex = (date) => {
    if (!parsed.min || !date) return 0;
    const diff = Math.round((date - parsed.min) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <Link
          to={`/app/workspaces/${workspaceId}/projects/${projectId}`}
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: "#f3f4f6",
            color: "#1d4ed8",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ← Back
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ margin: 0 }}>Gantt Chart</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "#f3f4f6",
              cursor: "pointer",
            }}
            onClick={() => {
              const svg = document.getElementById("gantt-svg");
              if (!svg) return;
              const serializer = new XMLSerializer();
              const source = serializer.serializeToString(svg);
              const blob = new Blob([source], {
                type: "image/svg+xml;charset=utf-8",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `gantt-chart-${projectId}.svg`;
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }, 100);
            }}
          >
            Download SVG
          </button>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "#f3f4f6",
              cursor: "pointer",
            }}
            onClick={() => {
              // Download as CSV
              const csv = ["Task,Start,Due"];
              parsed.items.forEach((i) => {
                csv.push(
                  `"${i.title}",${
                    i.start ? i.start.toISOString().split("T")[0] : ""
                  },${i.due ? i.due.toISOString().split("T")[0] : ""}`
                );
              });
              const blob = new Blob([csv.join("\n")], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `gantt-tasks-${projectId}.csv`;
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }, 100);
            }}
          >
            Download CSV
          </button>
          <Link to={`/app/workspaces/${workspaceId}/projects/${projectId}`}>
            Back to Project
          </Link>
        </div>
      </div>
      {loading && <p style={{ color: "#6b7280" }}>Loading…</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {!loading && !error && (
        <div style={{ marginTop: 12 }}>
          {/* Controls */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label style={{ fontSize: 12, color: "#6b7280" }}>Zoom</label>
            <input
              type="range"
              min={8}
              max={48}
              step={1}
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value, 10))}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: 12,
            }}
          >
            {/* Left: task list */}
            <div>
              <div style={{ fontWeight: 600, padding: "4px 0" }}>Task</div>
              <div style={{ display: "grid", gap: 6 }}>
                {parsed.items.map((i) => (
                  <div
                    key={i.id}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {i.title}
                  </div>
                ))}
                {parsed.items.length === 0 && (
                  <p style={{ color: "#6b7280" }}>No tasks in this project.</p>
                )}
              </div>
            </div>
            {/* Right: timeline */}
            <div
              style={{
                overflowX: "auto",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >
              {/* Header days */}
              {parsed.min && parsed.max && (
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                    zIndex: 1,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {headerDays.map((d, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: zoom,
                          textAlign: "center",
                          fontSize: 10,
                          color: "#6b7280",
                          padding: 2,
                          borderRight: "1px solid #f3f4f6",
                        }}
                      >
                        {d.getMonth() + 1}/{d.getDate()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Bars */}
              <div style={{ position: "relative" }}>
                <svg
                  id="gantt-svg"
                  width={Math.max(0, parsed.dayCount * zoom)}
                  height={Math.max(100, parsed.items.length * 28)}
                >
                  {/* Grid lines */}
                  {headerDays.map((_, idx) => (
                    <line
                      key={idx}
                      x1={idx * zoom}
                      y1={0}
                      x2={idx * zoom}
                      y2={parsed.items.length * 28}
                      stroke="#f3f4f6"
                      strokeWidth={1}
                    />
                  ))}
                  {/* Task bars */}
                  {parsed.items.map((i, rowIdx) => {
                    if (!i.start || !i.due) return null;
                    const x = dayIndex(i.start) * zoom;
                    const width = Math.max(
                      zoom,
                      (dayIndex(i.due) - dayIndex(i.start) + 1) * zoom
                    );
                    const y = rowIdx * 28 + 6;
                    return (
                      <a
                        key={i.id}
                        href={`/app/workspaces/${workspaceId}/projects/${projectId}?task=${i.id}`}
                      >
                        <rect
                          x={x}
                          y={y}
                          rx={4}
                          ry={4}
                          width={width}
                          height={16}
                          fill="#3b82f6"
                          opacity={0.85}
                        />
                      </a>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGantt;
