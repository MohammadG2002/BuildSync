import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasks } from "../../../services/taskService";

const ProjectNetwork = () => {
  const { workspaceId, projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nodeW] = useState(160);
  const [nodeH] = useState(56);
  const [hGap] = useState(80);
  const [vGap] = useState(32);

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

  const graph = useMemo(() => {
    const items = new Map();
    (tasks || []).forEach((t) => {
      const id = (t._id || t.id || "").toString();
      if (!id) return;
      // parse dates similarly to Gantt
      const toDate = (s) => {
        if (!s) return null;
        const d = new Date(s);
        if (isNaN(d.getTime())) return null;
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      };
      const start = toDate(t.startDate);
      const due = toDate(t.dueDate);
      items.set(id, {
        id,
        title: `${t.sequence ? `#${t.sequence} ` : ""}${t.title || "Untitled"}`,
        deps: (t.dependencies || []).map((d) =>
          (typeof d === "string" ? d : d?._id || d?.id || d)?.toString()
        ),
        start,
        due,
        priority: t.priority,
        status: t.status,
      });
    });

    // Compute depth (longest path from roots)
    const depth = new Map();
    const visiting = new Set();
    const memo = new Map();
    const dfsDepth = (id) => {
      if (memo.has(id)) return memo.get(id);
      if (visiting.has(id)) return 0; // cycle guard
      visiting.add(id);
      const n = items.get(id);
      let d = 0;
      if (n && Array.isArray(n.deps) && n.deps.length) {
        d =
          1 +
          Math.max(
            ...n.deps.filter((x) => items.has(x)).map((x) => dfsDepth(x))
          );
      }
      visiting.delete(id);
      memo.set(id, d);
      return d;
    };
    items.forEach((_, id) => depth.set(id, dfsDepth(id)));

    // Group by depth
    const levels = [];
    items.forEach((_, id) => {
      const d = depth.get(id) || 0;
      if (!levels[d]) levels[d] = [];
      levels[d].push(id);
    });

    // Coordinates
    const positions = new Map();
    levels.forEach((ids, col) => {
      ids.forEach((id, row) => {
        const x = col * (nodeW + hGap);
        const y = row * (nodeH + vGap);
        positions.set(id, { x, y });
      });
    });

    // Edges
    const edges = [];
    items.forEach((n, id) => {
      n.deps.forEach((fromId) => {
        if (!positions.has(fromId) || !positions.has(id)) return;
        edges.push({ from: fromId, to: id });
      });
    });

    // Canvas size
    const width = (levels.length || 1) * (nodeW + hGap) + 40;
    const height = Math.max(
      200,
      Math.max(...levels.map((ids) => (ids.length || 1) * (nodeH + vGap))) + 40
    );

    return { items, positions, edges, width, height, levels };
  }, [tasks, nodeW, nodeH, hGap, vGap]);

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
        <h1 style={{ margin: 0 }}>Network Diagram</h1>
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
              const svg = document.getElementById("network-svg");
              if (!svg) return;
              const serializer = new XMLSerializer();
              const source = serializer.serializeToString(svg);
              const blob = new Blob([source], {
                type: "image/svg+xml;charset=utf-8",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `network-diagram-${projectId}.svg`;
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
              const csv = ["Task,Dependencies"];
              Array.from(graph.items.values()).forEach((n) => {
                csv.push(`"${n.title}","${n.deps.join(";")}"`);
              });
              const blob = new Blob([csv.join("\n")], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `network-tasks-${projectId}.csv`;
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
        <div
          style={{
            marginTop: 12,
            overflow: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          }}
        >
          <svg id="network-svg" width={graph.width} height={graph.height}>
            {/* Edges */}
            {graph.edges.map((e, idx) => {
              const a = graph.positions.get(e.from);
              const b = graph.positions.get(e.to);
              const x1 = a.x + nodeW;
              const y1 = a.y + nodeH / 2;
              const x2 = b.x;
              const y2 = b.y + nodeH / 2;
              const mx = (x1 + x2) / 2;
              return (
                <g key={idx}>
                  <path
                    d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                    stroke="#9ca3af"
                    fill="none"
                    strokeWidth={2}
                  />
                  {/* arrowhead */}
                  <polygon
                    points={`${x2},${y2} ${x2 - 6},${y2 - 3} ${x2 - 6},${
                      y2 + 3
                    }`}
                    fill="#9ca3af"
                  />
                </g>
              );
            })}
            {/* Nodes */}
            {Array.from(graph.items.values()).map((n) => {
              const p = graph.positions.get(n.id);
              const startStr = n.start
                ? n.start.toISOString().split("T")[0]
                : "-";
              const dueStr = n.due ? n.due.toISOString().split("T")[0] : "-";
              const titleText = `${
                n.title
              }\nStart: ${startStr}\nDue: ${dueStr}\nPriority: ${
                n.priority || "N/A"
              }\nStatus: ${n.status || "N/A"}`;
              return (
                <a
                  key={n.id}
                  href={`/app/workspaces/${workspaceId}/projects/${projectId}?task=${n.id}`}
                >
                  <g>
                    <title>{titleText}</title>
                    <rect
                      x={p.x}
                      y={p.y}
                      rx={8}
                      ry={8}
                      width={nodeW}
                      height={nodeH}
                      fill="#ffffff"
                      stroke="#e5e7eb"
                    />
                    <text
                      x={p.x + 12}
                      y={p.y + 22}
                      fontSize={12}
                      fill="#111827"
                    >
                      {n.title}
                    </text>
                    <text
                      x={p.x + 12}
                      y={p.y + 40}
                      fontSize={10}
                      fill="#6b7280"
                    >
                      {graph.items.get(n.id)?.deps?.length || 0} deps
                    </text>
                  </g>
                </a>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProjectNetwork;
