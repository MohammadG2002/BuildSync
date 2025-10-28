import { memo } from "react";
import { getCardClassName, CardHeader } from "./card/index";

const Card = ({ children, title, action, className = "", ...props }) => {
  return (
    <div className={getCardClassName(className)} {...props}>
      <CardHeader title={title} action={action} />
      {children}
    </div>
  );
};

export default memo(Card);
