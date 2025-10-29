import styles from "./Input.module.css";

const InputIcon = ({ Icon }) => {
  if (!Icon) return null;

  return (
    <div className={styles.icon}>
      <Icon className={styles.iconSvg} />
    </div>
  );
};

export default InputIcon;
