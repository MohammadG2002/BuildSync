import { Tag } from "lucide-react";
import styles from "./TagsSection.module.css";

const TagsSection = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div>
      <div className={styles.metadataItemHeader}>
        <Tag className={styles.metadataIcon} />
        <h3 className={styles.metadataItemTitle}>Tags</h3>
      </div>
      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;
