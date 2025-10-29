import styles from "./TaskCard.module.css";

const TaskTitle = ({ title, completed }) => {
  const titleClasses = [styles.title, completed ? styles.titleCompleted : ""]
    .filter(Boolean)
    .join(" ");

  return <h3 className={titleClasses}>{title}</h3>;
};

export default TaskTitle;
