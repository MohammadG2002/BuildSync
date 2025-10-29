import { memo } from "react";
import CardHeader from "../card/CardHeader";
import styles from "./Card.module.css";

const Card = ({ children, title, action, className = "", ...props }) => {
  const cardClasses = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div className={cardClasses} {...props}>
      <CardHeader title={title} action={action} />
      {children}
    </div>
  );
};

export default memo(Card);
