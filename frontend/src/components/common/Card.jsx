import { memo } from "react";

const Card = ({ children, title, action, className = "", ...props }) => {
  return (
    <div
      className={`card dark:bg-gray-800 dark:border-gray-700 ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 dark:text-gray-100">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default memo(Card);
