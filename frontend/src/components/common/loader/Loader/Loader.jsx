import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import SkeletonList from "../SkeletonList/SkeletonList";
import SkeletonTable from "../SkeletonTable/SkeletonTable";
import SkeletonStats from "../SkeletonStats/SkeletonStats";
import styles from "./Loader.module.css";

const Loader = ({ size = "md", fullScreen = false, text }) => {
  const loader = <LoaderSpinner size={size} text={text} />;

  if (fullScreen) {
    return <div className={styles.fullScreen}>{loader}</div>;
  }

  return loader;
};

// Re-export skeleton components
export { SkeletonCard, SkeletonList, SkeletonTable, SkeletonStats };

export default Loader;
