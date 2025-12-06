import { Check } from "lucide-react";
import styles from "./CompletionContent.module.css";

const CompletionContent = ({ title, description }) => (
  <div className={styles.completion}>
    <div className={styles.completionIcon}>
      <Check className={styles.completionCheckIcon} />
    </div>
    <h3 className={styles.completionTitle}>{title}</h3>
    <p className={styles.completionDescription}>{description}</p>
  </div>
);

export default CompletionContent;
