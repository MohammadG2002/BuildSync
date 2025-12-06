import Card from "../../common/card/Card/Card";
import styles from "./WorkspaceStatCard.module.css";

const WorkspaceStatCard = ({ label, value, icon: Icon, color }) => {
  const getColorClass = (color) => {
    if (color === "blue") return styles.statIconBlue;
    if (color === "green") return styles.statIconGreen;
    if (color === "purple") return styles.statIconPurple;
    return "";
  };

  return (
    <Card>
      <div className={styles.statCard}>
        <div className={styles.statInfo}>
          <p className={styles.statLabel}>{label}</p>
          <p className={styles.statValue}>{value}</p>
        </div>
        <div className={`${styles.statIcon} ${getColorClass(color)}`}>
          <Icon className={styles.statIconImage} />
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceStatCard;
