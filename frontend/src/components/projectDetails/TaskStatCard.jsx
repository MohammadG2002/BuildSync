import Card from "../../../components/common/Card";
import styles from "../ProjectDetails.module.css";

const TaskStatCard = ({ label, value, icon: Icon, color = "gray" }) => {
  const getIconClass = (color) => {
    if (color === "gray") return styles.statIconGray;
    if (color === "blue") return styles.statIconBlue;
    if (color === "yellow") return styles.statIconYellow;
    if (color === "green") return styles.statIconGreen;
    return "";
  };

  const getValueClass = (color) => {
    if (color === "gray") return styles.statValueGray;
    if (color === "blue") return styles.statValueBlue;
    if (color === "yellow") return styles.statValueYellow;
    if (color === "green") return styles.statValueGreen;
    return "";
  };

  return (
    <Card>
      <div className={styles.statCard}>
        <div className={styles.statInfo}>
          <p className={styles.statLabel}>{label}</p>
          <p className={`${styles.statValue} ${getValueClass(color)}`}>
            {value}
          </p>
        </div>
        <Icon className={`${styles.statIcon} ${getIconClass(color)}`} />
      </div>
    </Card>
  );
};

export default TaskStatCard;
