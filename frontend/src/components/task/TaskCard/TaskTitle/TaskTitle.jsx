import styles from "./TaskTitle.module.css";

const TaskTitle = ({ title, completed, sequence }) => {
  const titleClasses = [styles.title, completed ? styles.titleCompleted : ""]
    .filter(Boolean)
    .join(" ");
  return <h3 className={titleClasses}>{title}</h3>;
};

export default TaskTitle;
