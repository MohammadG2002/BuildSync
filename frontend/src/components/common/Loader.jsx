import LoaderSpinner from "./loader/LoaderSpinner";
import SkeletonCard from "./loader/SkeletonCard";
import SkeletonList from "./loader/SkeletonList";
import SkeletonTable from "./loader/SkeletonTable";
import SkeletonStats from "./loader/SkeletonStats";
import styles from "./loader/Loader.module.css";

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
