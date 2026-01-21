import { useState } from "react";
import styles from "./LazyImage.module.css";

/**
 * LazyImage Component
 * Provides lazy loading with blur-up effect for images
 */
const LazyImage = ({
  src,
  alt,
  className,
  placeholderClassName,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`${styles.lazyImageWrapper} ${className || ""}`}>
      {!isLoaded && !hasError && (
        <div
          className={`${styles.placeholder} ${placeholderClassName || ""}`}
          aria-hidden="true"
        />
      )}
      {hasError ? (
        <div
          className={styles.errorPlaceholder}
          aria-label="Image failed to load"
        >
          ⚠️
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`${styles.lazyImage} ${isLoaded ? styles.loaded : ""} ${
            className || ""
          }`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
