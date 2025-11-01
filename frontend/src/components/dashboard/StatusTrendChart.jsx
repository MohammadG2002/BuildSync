import styles from "./Dashboard.module.css";

// Props: { labels: ["Sat",...], series: { statusKey: [7 numbers], ... } }
// Minimal stacked bar per day (Sat-Fri) using CSS; colors map by status
const STATUS_COLORS = {
  todo: "#9ca3af",
  "in-progress": "#2563eb",
  review: "#f59e0b",
  completed: "#16a34a",
  blocked: "#dc2626",
};

const StatusTrendChart = ({ data }) => {
  if (!data || !data.labels || !data.series) return null;
  const { labels, series } = data;

  // Compute max per day to scale stacked bars
  const dayTotals = labels.map((_, i) =>
    Object.values(series).reduce((sum, arr) => sum + (arr[i] || 0), 0)
  );
  const maxTotal = Math.max(1, ...dayTotals);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartGrid}>
        {labels.map((label, i) => {
          const parts = Object.keys(series).map((key) => ({
            key,
            value: series[key][i] || 0,
          }));
          const total = dayTotals[i] || 0;
          return (
            <div key={label + i} className={styles.chartDayColumn}>
              <div className={styles.chartBarStack}>
                {parts.map(({ key, value }) => {
                  if (!value) return null;
                  const height = (total ? value / maxTotal : 0) * 100;
                  return (
                    <div
                      key={key}
                      className={styles.chartBarSegment}
                      style={{
                        height: `${height}%`,
                        backgroundColor: STATUS_COLORS[key] || "#6b7280",
                      }}
                      title={`${label} • ${key}: ${value}`}
                    />
                  );
                })}
              </div>
              <div className={styles.chartDayLabel}>{label}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.chartLegend}>
        {Object.keys(series).map((key) => (
          <div key={key} className={styles.chartLegendItem}>
            <span
              className={styles.chartLegendSwatch}
              style={{ backgroundColor: STATUS_COLORS[key] || "#6b7280" }}
            />
            <span className={styles.chartLegendLabel}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTrendChart;
