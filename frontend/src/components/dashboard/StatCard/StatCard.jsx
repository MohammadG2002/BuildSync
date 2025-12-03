import Card from "../../common/card/Card";
import { TrendingUp } from "lucide-react";
import styles from "./StatCard.module.css";

const StatCard = ({ stat }) => {
  const Icon = stat.icon;

  const iconColorClass = {
    blue: styles.iconBlue,
    yellow: styles.iconYellow,
    green: styles.iconGreen,
    purple: styles.iconPurple,
  }[stat.color];

  return (
    <Card className={styles.statCard}>
      <div className={styles.statContent}>
        <div className={styles.statInfo}>
          <p className={styles.statTitle}>{stat.title}</p>
          <p className={styles.statValue}>{stat.value}</p>
          <div className={styles.statChange}>
            {stat.trend === "up" && <TrendingUp className={styles.trendIcon} />}
            <span>{stat.change}</span>
          </div>
        </div>
        <div className={`${styles.statIcon} ${iconColorClass}`}>
          <Icon className={styles.statIconSvg} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
