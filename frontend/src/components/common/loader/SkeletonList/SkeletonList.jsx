import SkeletonCard from "../SkeletonCard/SkeletonCard";
import styles from "./SkeletonList.module.css";

const SkeletonList = ({ count = 3 }) => (
  <div className={styles.skeletonList}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonList;
