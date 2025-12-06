import styles from "./StepContent.module.css";

const StepContent = ({ title, description }) => (
  <>
    <h3 className={styles.stepTitle}>{title}</h3>
    <p className={styles.stepDescription}>{description}</p>
  </>
);

export default StepContent;
