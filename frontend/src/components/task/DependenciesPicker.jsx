import { useEffect, useMemo, useState } from "react";
import { Link as LinkIcon, ChevronDown } from "lucide-react";
import { useParams } from "react-router-dom";
import styles from "./taskFormModule/TaskForm.module.css";

// Minimal API helper: expects getProjectTasks(workspaceId, projectId) that returns an array of tasks
// We'll import from services/taskService if available.

const DependenciesPicker = ({
  workspaceId,
  projectId,
  currentTaskId,
  selected = [],
  onChange,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  // Fallback to route params if props are missing or objects
  const params = useParams?.() || {};
  const resolvedWorkspaceId = useMemo(() => {
    const val =
      typeof workspaceId === "object" ? workspaceId?._id : workspaceId;
    return val || params.workspaceId || window.__WS_ID;
  }, [workspaceId, params.workspaceId]);
  const resolvedProjectId = useMemo(() => {
    const val = typeof projectId === "object" ? projectId?._id : projectId;
    return val || params.projectId || window.__PROJECT_ID;
  }, [projectId, params.projectId]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const { getTasks } = await import("../../services/taskService");
        // Fetch tasks by project
        const list = await getTasks(resolvedWorkspaceId, resolvedProjectId);
        setTasks(list);
      } catch (e) {
        console.error("Failed to load tasks for dependencies:", e);
        setError("Failed to load tasks");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, resolvedWorkspaceId, resolvedProjectId]);

  const eligibleTasks = useMemo(() => {
    const pid = resolvedProjectId ? String(resolvedProjectId) : "";
    const scoped = (tasks || []).filter((t) => {
      const proj = typeof t.project === "object" ? t.project?._id : t.project;
      return pid ? String(proj) === pid : true;
    });
    return scoped.filter((t) => (t._id || t.id) !== currentTaskId);
  }, [tasks, currentTaskId, resolvedProjectId]);

  const selectedSet = useMemo(() => new Set(selected.map(String)), [selected]);

  const toggle = (id) => {
    const str = String(id);
    const next = new Set(selectedSet);
    if (next.has(str)) next.delete(str);
    else next.add(str);
    // Pass both selected IDs and eligibleTasks to parent
    onChange(Array.from(next), eligibleTasks);
  };

  return (
    <div>
      <button
        type="button"
        className={styles.attachmentsButton}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <LinkIcon className={styles.attachmentsIcon} />
          <span style={{ fontWeight: 600 }}>Dependencies</span>
          {selected && selected.length > 0 && (
            <span style={{ marginLeft: 8, color: "#6b7280", fontWeight: 600 }}>
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown className={styles.attachmentsIcon} />
      </button>
      {open && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
            marginTop: 8,
          }}
        >
          {loading && <p style={{ color: "#6b7280" }}>Loading tasks…</p>}
          {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
          {!loading && !error && (
            <div
              style={{
                maxHeight: 240,
                overflowY: "auto",
                display: "grid",
                gap: 8,
              }}
            >
              {eligibleTasks.length === 0 && (
                <p style={{ color: "#6b7280" }}>
                  No tasks available in this project.
                </p>
              )}
              {eligibleTasks.map((t) => {
                const id = t._id || t.id;
                const checked = selectedSet.has(String(id));
                const label = `${t.sequence ? `#${t.sequence} ` : ""}${
                  t.title
                }`;
                return (
                  <label
                    key={id}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(id)}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DependenciesPicker;
