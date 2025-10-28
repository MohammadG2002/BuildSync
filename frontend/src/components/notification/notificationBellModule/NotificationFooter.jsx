const NotificationFooter = ({ onClick }) => {
  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
      <button
        onClick={onClick}
        className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
      >
        View all notifications
      </button>
    </div>
  );
};

export default NotificationFooter;
