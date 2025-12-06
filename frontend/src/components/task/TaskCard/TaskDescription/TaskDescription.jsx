import styles from "./TaskDescription.module.css";

const TaskDescription = ({ description }) => {
  if (!description) return null;

  return <p className={styles.description}>{description}</p>;
};

export default TaskDescription;
