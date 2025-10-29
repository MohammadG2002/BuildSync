import Card from "../../../components/common/Card";
import styles from "../Archived.module.css";

const ArchivedLoadingState = () => {
  return (
    <div className={styles.loadingGrid}>
      {[1, 2, 3].map((i) => (
        <Card key={i} className={styles.loadingCard}>
          <div className={styles.loadingCardInner}></div>
        </Card>
      ))}
    </div>
  );
};

export default ArchivedLoadingState;
