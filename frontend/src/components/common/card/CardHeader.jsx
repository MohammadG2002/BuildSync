const CardHeader = ({ title, action }) => {
  if (!title && !action) return null;

  return (
    <div className="flex items-center justify-between mb-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default CardHeader;
