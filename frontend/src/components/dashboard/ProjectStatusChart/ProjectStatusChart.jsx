import styles from "./ProjectStatusChart.module.css";

// Props: { labels: [...], counts: { status: number } }
const STATUS_COLORS = {
  planning: "#6b7280",
  active: "#2563eb",
  "on-hold": "#f59e0b",
  completed: "#16a34a",
  archived: "#9ca3af",
};

const ProjectStatusChart = ({ data }) => {
  if (!data || !data.labels || !data.counts) return null;
  const { labels, counts } = data;
  const max = Math.max(1, ...labels.map((l) => counts[l] || 0));

  return (
    <div className={styles.chartContainer}>
      <div className={styles.hBarList}>
        {labels.map((label) => {
          const value = counts[label] || 0;
          const width = (value / max) * 100;
          return (
            <div key={label} className={styles.hBarRow}>
              <div className={styles.hBarLabel}>{label}</div>
              <div className={styles.hBarTrack}>
                <div
                  className={styles.hBarFill}
                  style={{
                    width: `${width}%`,
                    backgroundColor: STATUS_COLORS[label] || "#6b7280",
                  }}
                  title={`${label}: ${value}`}
                />
              </div>
              <div className={styles.hBarValue}>{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStatusChart;
