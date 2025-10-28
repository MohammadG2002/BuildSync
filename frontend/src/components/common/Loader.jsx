import {
  loaderSizes,
  LoaderSpinner,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonStats,
} from "./loader/index";

const Loader = ({ size = "md", fullScreen = false, text }) => {
  const loader = <LoaderSpinner size={size} sizes={loaderSizes} text={text} />;

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {loader}
      </div>
    );
  }

  return loader;
};

// Re-export skeleton components
export { SkeletonCard, SkeletonList, SkeletonTable, SkeletonStats };

export default Loader;
